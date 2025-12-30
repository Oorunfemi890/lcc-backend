import db from "../../models";
const { FollowUp, FirstTimer, Member } = db;
import MailHelper from "../helpers/email.helper.js";
import SmsService from "../service/sms.service.js";
import WhatsappService from "../service/whatsapp.service.js";
import { logger } from '../logger/winston';
import MESSAGES from '../constant/messages.constant.js';

class FollowUpController {
  // ✅ Create a follow-up
  static async createFollowUp(req, res) {
    try {
      const {
        firstTimerId,
        targetMemberId,
        assignedToMemberId,
        followUpType,
        scheduledDate,
        notes, // This is the "Message" content
        nextFollowUpDate,
      } = req.body;

      // 1. Validation
      if ((!firstTimerId && !targetMemberId) || !followUpType || !scheduledDate) {
        return res.status(400).send({
          message: "Missing required fields: {firstTimerId OR targetMemberId, followUpType, scheduledDate}"
        });
      }

      // 2. Determine Target (FirstTimer or Member)
      let targetUser = null;
      let targetName = "";
      let targetPhone = "";
      let targetEmail = "";

      if (firstTimerId) {
        targetUser = await FirstTimer.findByPk(firstTimerId);
        if (targetUser) {
          targetName = `${targetUser.surname} ${targetUser.otherNames}`;
          targetPhone = targetUser.phoneNumber;
          targetEmail = targetUser.email;
        }
      } else if (targetMemberId) {
        targetUser = await Member.findByPk(targetMemberId);
        if (targetUser) {
          targetName = `${targetUser.firstName} ${targetUser.lastName}`;
          targetPhone = targetUser.phoneNumber;
          targetEmail = targetUser.email;
        }
      }

      if (!targetUser) {
        return res.status(404).send({ message: "Target user (First Timer or Member) not found" });
      }

      // 3. Create FollowUp Record
      const followUp = await FollowUp.create({
        firstTimerId: firstTimerId || null,
        targetMemberId: targetMemberId || null,
        assignedToMemberId: assignedToMemberId || null,
        followUpType,
        scheduledDate,
        notes,
        nextFollowUpDate,
      });

      // 4. Handle Notification / Assignment Logic based on selected types
      try {
        // Fetch global settings (Single DB Call)
        const settings = await db.Settings.getAllSettingsAsObject();
        const smsEnabled = settings['sms'];
        const whatsappEnabled = settings['whatsapp'];
        const emailEnabled = settings['email'];
        const voiceCallEnabled = settings['voice_call'];

        // Ensure followUpType is an array
        const types = Array.isArray(followUpType) ? followUpType : [followUpType];

        // Check for Visit types -> Notify Worker
        const hasVisit = types.some(t => ['home_visit', 'church_visit'].includes(t));
        if (hasVisit && assignedToMemberId) {
          const worker = await Member.findByPk(assignedToMemberId);
          if (worker) {
            const workerName = `${worker.firstName} ${worker.lastName}`;
            const visitTypes = types.filter(t => ['home_visit', 'church_visit'].includes(t)).join(', ');
            const msgBody = MESSAGES.FOLLOW_UP.WORKER_ASSIGNMENT(workerName, targetName, visitTypes, notes);

            // Notify Worker via Email (check setting)
            if (worker.email && emailEnabled !== 'false') {
              await MailHelper.sendMail({
                to: worker.email,
                subject: `New Follow-Up Assignment: ${targetName}`,
                template: 'generic-notification',
                params: {
                  name: workerName,
                  title: `New Follow-Up Assignment`,
                  body: msgBody
                }
              }).catch(err => logger.error(`Failed to email worker ${worker.id}: ${err.message}`));
            }

            // Notify Worker via WhatsApp (check setting)
            if (worker.phoneNumber && whatsappEnabled !== 'false') {
              const waService = new WhatsappService();
              await waService.send(worker.phoneNumber, msgBody).catch(err => logger.error(`Failed to WA worker: ${err.message}`));
            }
          }
        }

        // Digital notifications to target
        const messageContent = `${notes} ${MESSAGES.FOLLOW_UP.FOOTER}`;

        // Send Phone Call if included and enabled
        if (types.includes('phone_call') && targetPhone && voiceCallEnabled !== 'false') {
          const smsService = new SmsService();
          await smsService.sendVoiceCall(targetPhone, notes).catch(err => logger.error(`Failed voice call: ${err.message}`));
        }

        // Send SMS if included and enabled
        if (types.includes('sms') && targetPhone && smsEnabled !== 'false') {
          const smsService = new SmsService();
          await smsService.send(targetPhone, messageContent).catch(err => logger.error(`Failed SMS: ${err.message}`));
        }

        // Send WhatsApp if included and enabled
        if (types.includes('whatsapp') && targetPhone && whatsappEnabled !== 'false') {
          const waService = new WhatsappService();
          await waService.send(targetPhone, messageContent).catch(err => logger.error(`Failed WA: ${err.message}`));
        }

        // Send Email if included and enabled
        if (types.includes('email') && targetEmail && emailEnabled !== 'false') {
          await MailHelper.sendMail({
            to: targetEmail,
            subject: 'Message from Liberty Christian Centre',
            template: 'generic-notification',
            params: {
              name: targetName,
              title: 'Message from LCC',
              body: notes
            }
          }).catch(err => logger.error(`Failed Email: ${err.message}`));
        }
      } catch (notifyErr) {
        logger.error(`Notification Error in createFollowUp: ${notifyErr.message}`);
        // Do not fail the request creation
      }

      // 5. Return Response
      const fullFollowUp = await FollowUp.findByPk(followUp.id, {
        include: [
          { model: FirstTimer, as: "firstTimer", attributes: ["id", "surname", "otherNames", "phoneNumber"] },
          { model: Member, as: "targetMember", attributes: ["id", "firstName", "lastName", "phoneNumber"] },
          { model: Member, as: "assignedMember", attributes: ["id", "firstName", "lastName", "membershipType"] },
        ],
      });

      return res.status(201).send({
        message: "Follow-up created successfully",
        data: fullFollowUp,
      });
    } catch (error) {
      console.error("Error creating follow-up:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  // ✅ Get all follow-ups (paginated + filter by queries)
  static async getAllFollowUps(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        followUpType,
        assignedToMemberId,
        firstTimerId,
        startDate,
        endDate,
      } = req.query;

      const where = {};

      if (status) where.status = status;
      if (followUpType) where.followUpType = followUpType;
      if (assignedToMemberId) where.assignedToMemberId = assignedToMemberId;
      if (assignedToMemberId) where.assignedToMemberId = assignedToMemberId;
      if (firstTimerId) where.firstTimerId = firstTimerId;
      if (req.query.targetMemberId) where.targetMemberId = req.query.targetMemberId;

      // Date range filter (scheduledDate)
      if (startDate && endDate) {
        where.scheduledDate = {
          [db.Sequelize.Op.between]: [startDate, endDate],
        };
      } else if (startDate) {
        where.scheduledDate = { [db.Sequelize.Op.gte]: startDate };
      } else if (endDate) {
        where.scheduledDate = { [db.Sequelize.Op.lte]: endDate };
      }

      const offset = (page - 1) * limit;

      const { count, rows } = await FollowUp.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset,
        order: [["scheduledDate", "DESC"]],
        include: [
          { model: FirstTimer, as: "firstTimer", attributes: ["id", "surname", "otherNames", "phoneNumber"] },
          { model: Member, as: "targetMember", attributes: ["id", "firstName", "lastName", "phoneNumber"] },
          { model: Member, as: "assignedMember", attributes: ["id", "firstName", "lastName", "membershipType"] },
        ],
      });

      return res.status(200).send({
        message: "Follow-ups retrieved successfully",
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
        data: rows,
      });
    } catch (error) {
      console.error("Error fetching follow-ups:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }


  static async getFollowUpById(req, res) {
    try {
      const { id } = req.params;
      const followUp = await FollowUp.findByPk(id, {
        include: [
          { model: FirstTimer, as: "firstTimer", attributes: ["id", "surname", "otherNames", "phoneNumber"] },
          { model: Member, as: "assignedMember", attributes: ["id", "firstName", "lastName", "membershipType"] },
        ],
      });

      if (!followUp) {
        return res.status(404).send({ message: "Follow-up not found" });
      }

      return res.status(200).send({
        message: "Follow-up retrieved successfully",
        data: followUp,
      });
    } catch (error) {
      console.error("Error fetching follow-up:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  // ✅ Update follow-up
  static async updateFollowUp(req, res) {
    try {
      const { id } = req.params;
      const [updated] = await FollowUp.update(req.body, { where: { id } });

      if (!updated) {
        return res.status(404).send({ message: "Follow-up not found" });
      }

      const updatedFollowUp = await FollowUp.findByPk(id, {
        include: [
          { model: FirstTimer, as: "firstTimer", attributes: ["id", "surname", "otherNames", "phoneNumber"] },
          { model: Member, as: "assignedMember", attributes: ["id", "firstName", "lastName", "membershipType"] },
        ],
      });

      return res.status(200).send({
        message: "Follow-up updated successfully",
        data: updatedFollowUp,
      });
    } catch (error) {
      console.error("Error updating follow-up:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  // ✅ Delete follow-up
  static async deleteFollowUp(req, res) {
    try {
      const { id } = req.params;
      const deleted = await FollowUp.destroy({ where: { id } });

      if (!deleted) {
        return res.status(404).send({ message: "Follow-up not found" });
      }

      return res.status(200).send({ message: "Follow-up deleted successfully" });
    } catch (error) {
      console.error("Error deleting follow-up:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }
}

export default FollowUpController;
