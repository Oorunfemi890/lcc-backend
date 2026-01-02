import db from "../../models";
const { FirstTimer, FollowUp } = db;
import { Op } from "sequelize";
import MailHelper from "../helpers/email.helper.js";
import SmsService from "../service/sms.service.js";
import WhatsappService from "../service/whatsapp.service.js";
import { logger } from '../logger/winston';
import MESSAGES from '../constant/messages.constant.js';

class FirstTimerController {
  /**
   * Create First Timer
   */
  static async createFirstTimer(req, res) {
    try {
      const data = req.body;

      const firstTimer = await FirstTimer.create(data);

      // Send welcome messages via Email, SMS, and WhatsApp
      try {
        const name = `${firstTimer.surname} ${firstTimer.otherNames}`;
        const email = firstTimer.email;
        const phoneNumber = firstTimer.phoneNumber;

        // Prepare welcome messages from constants
        const smsMessage = MESSAGES.FIRST_TIMER.SMS(firstTimer.surname);
        const whatsappMessage = MESSAGES.FIRST_TIMER.WHATSAPP(name);

        // Send Email (if email provided)
        if (email) {
          MailHelper.sendMail({
            to: email,
            subject: 'Welcome to Liberty Christian Centre',
            template: 'first-timer-welcome',
            params: {
              name: name
            }
          });
        }

        // Send SMS (if phone number provided)
        if (phoneNumber) {
          const smsService = new SmsService();
          smsService.send(phoneNumber, smsMessage);
        }

        // Send WhatsApp (if phone number provided)
        if (phoneNumber) {
          const whatsappService = new WhatsappService();
          whatsappService.send(phoneNumber, whatsappMessage);
        }

        logger.info(`Welcome messages sent to ${name} (Email: ${email}, Phone: ${phoneNumber})`);
      } catch (notificationError) {
        logger.error('Failed to send welcome notifications:', notificationError);
        // Don't fail the request if notifications fail
      }

      return res.status(201).send({
        message: "First timer created successfully. Welcome messages sent!",
        data: firstTimer,
      });
    } catch (error) {
      logger.error("Error creating first timer:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * Get All First Timers (with query filters + pagination)
   */
  static async getAllFirstTimers(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        maritalStatus,
        ageGroup,
        visitDate,
        startDate,
        endDate,
        interestedInJoining,
        search,
      } = req.query;

      const where = {};

      if (maritalStatus) where.maritalStatus = maritalStatus;
      if (ageGroup) where.ageGroup = ageGroup;
      if (visitDate) where.visitDate = visitDate;
      if (interestedInJoining) where.interestedInJoining = interestedInJoining === "true";

      if (search) {
        where[Op.or] = [
          { surname: { [Op.iLike]: `%${search}%` } },
          { otherNames: { [Op.iLike]: `%${search}%` } },
          { phoneNumber: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ];
      }

      // Date range filtering
      if (startDate && endDate) {
        where.visitDate = { [Op.between]: [startDate, endDate] };
      } else if (startDate) {
        where.visitDate = { [Op.gte]: startDate };
      } else if (endDate) {
        where.visitDate = { [Op.lte]: endDate };
      }

      const offset = (page - 1) * limit;

      const { count, rows } = await FirstTimer.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: FollowUp,
            as: "followUps",
            attributes: ["id", "followUpType", "status", "scheduledDate"],
          },
        ],
      });

      return res.status(200).send({
        message: "First timers retrieved successfully",
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
        data: rows,
      });
    } catch (error) {
      logger.error("Error fetching first timers:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * Get Single First Timer
   */
  static async getFirstTimer(req, res) {
    try {
      const { id } = req.params;

      const firstTimer = await FirstTimer.findByPk(id, {
        include: [
          {
            model: FollowUp,
            as: "followUps",
            attributes: ["id", "followUpType", "status", "scheduledDate"],
          },
        ],
      });

      if (!firstTimer) {
        return res.status(404).send({ message: "First timer not found" });
      }

      return res.status(200).send({
        message: "First timer retrieved successfully",
        data: firstTimer,
      });
    } catch (error) {
      logger.error("Error fetching first timer:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * Update First Timer
   */
  static async updateFirstTimer(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      const firstTimer = await FirstTimer.findByPk(id);
      if (!firstTimer) {
        return res.status(404).send({ message: "First timer not found" });
      }

      await firstTimer.update(data);

      return res.status(200).send({
        message: "First timer updated successfully",
        data: firstTimer,
      });
    } catch (error) {
      logger.error("Error updating first timer:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * Delete First Timer
   */
  static async deleteFirstTimer(req, res) {
    try {
      const { id } = req.params;

      const firstTimer = await FirstTimer.findByPk(id);
      if (!firstTimer) {
        return res.status(404).send({ message: "First timer not found" });
      }

      await firstTimer.destroy();

      return res.status(200).send({ message: "First timer deleted successfully" });
    } catch (error) {
      logger.error("Error deleting first timer:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }
}

export default FirstTimerController;
