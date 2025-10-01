import db from "../../models";
import { Op } from "sequelize";

const { Member, Testimony, FollowUp, AdminUser } = db;
import MailHelper from "../helpers/email.helper";

class MemberController {
  static async createMember(req, res) {
    try {
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        countryCode = "+234",
        address,
        dateOfBirth,
        maritalStatus,
        occupation,
        interests,
        membershipType = "member",
        emergencyContactName,
        emergencyContactPhone,
        emergencyContactRelationship,
        profilePicture,
        notes,
      } = req.body;



      const exists = await Member.findOne({ where: { email } });
      if (exists) {
        return res.status(409).send({ message: "Member with this email already exists" });
      }

      const newMember = await Member.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        countryCode,
        address,
        dateOfBirth,
        maritalStatus,
        occupation,
        interests,
        membershipType,
        emergencyContactName,
        emergencyContactPhone,
        emergencyContactRelationship,
        profilePicture,
        notes,
        memberSince: new Date(),
      });

      await MailHelper.sendMail({
        to: newMember.email,
        subject: "Welcome onBoard",
        template: "welcome",
        params: newMember,
      });

      return res.status(201).send({ message: "Member created successfully", data: newMember });
    } catch (error) {
      console.error("Error creating member:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  // ✅ Get All Members (Paginated + Filters)
  static async getAllMembers(req, res) {
    try {
      let { page = 1, limit = 10, search, active, membershipType } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      const offset = (page - 1) * limit;

      const where = {};
      if (active !== undefined) where.active = active === "true";
      if (membershipType) where.membershipType = membershipType;

      if (search) {
        where[Op.or] = [
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const { count, rows } = await Member.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
        attributes: { exclude: ["blockReason"] },
      });

      return res.status(200).send({
        message: "Members fetched successfully",
        pagination: {
          total: count,
          page,
          pages: Math.ceil(count / limit),
          limit,
        },
        data: rows,
      });
    } catch (error) {
      console.error("Error fetching members:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  // ✅ Get Single Member
  static async getOneMember(req, res) {
    try {
      const { id } = req.params;
      const member = await Member.findOne({
        where: { id },
        include: [
          { model: AdminUser, as: "adminUser" },
          { model: FollowUp, as: "followUps" },
          { model: Testimony, as: "testimonies" },
        ],
      });

      if (!member) {
        return res.status(404).send({ message: "Member not found" });
      }

      return res.status(200).send({ message: "Member fetched successfully", data: member });
    } catch (error) {
      console.error("Error fetching member:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  static async updateMember(req, res) {
    try {
      const { id } = req.params;
      const [updated] = await Member.update(req.body, { where: { id } });

      if (!updated) {
        return res.status(404).send({ message: "Member not found" });
      }

      const updatedMember = await Member.findByPk(id);
      return res.status(200).send({ message: "Member updated successfully", data: updatedMember });
    } catch (error) {
      console.error("Error updating member:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  static async deleteMember(req, res) {
    try {
      const { id } = req.params;
      const member = await Member.findByPk(id);

      if (!member) {
        return res.status(404).send({ message: "Member not found" });
      }

      await member.update({ active: false });
      return res.status(200).send({ message: "Member deactivated successfully" });
    } catch (error) {
      console.error("Error deleting member:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  // ✅ Block Member
  static async blockMember(req, res) {
    try {
      const { id } = req.params;
      await Member.update(
        { active: false, blockReason: req.body.reason || "Blocked by admin" },
        { where: { id } }
      );
      return res.status(200).send({ message: "Member blocked successfully" });
    } catch (error) {
      console.error("Error blocking member:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  // ✅ Unblock Member
  static async unBlockMember(req, res) {
    try {
      const { id } = req.params;
      await Member.update({ active: true, blockReason: null }, { where: { id } });
      return res.status(200).send({ message: "Member unblocked successfully" });
    } catch (error) {
      console.error("Error unblocking member:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }
}

export default MemberController;
