import db from "../../models";
import { Op } from "sequelize";

const { Member, Testimony, FollowUp, AdminUser } = db;
import MailHelper from "../helpers/email.helper";
import bcrypt from "bcryptjs";

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
        gender,
        maritalStatus,
        occupation,
        interests,
        membershipType = "Other",
        emergencyContactName,
        emergencyContactPhone,
        emergencyContactRelationship,
        notes,
        securityPin
      } = req.body;

      // Handle profile picture upload
      const profilePicture = req?.fileUrl
      const normalizedEmail = email ? email.toLowerCase().trim() : null;
      const normalizedPhone = phoneNumber ? phoneNumber.trim() : null;

      const memberExists = await Member.findOne({
        where: {
          [Op.or]: [
            { email: normalizedEmail },
            { phoneNumber: normalizedPhone }
          ]
        }
      });

      if (memberExists) {
        return res.status(409).send({ message: "Member with this email or phone number already exists" });
      }

      let ageGroup = null;
      if (dateOfBirth) {
        const dob = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          age--;
        }

        if (age < 10) {
          ageGroup = "children";
        } else if (age >= 10 && age <= 19) {
          ageGroup = "teenager";
        } else {
          ageGroup = "adult";
        }
      }

      // Hash the pin + phoneNumber + dateOfBirth
      // Ensure dateOfBirth is formatted consistently if used in hash
      const dobString = dateOfBirth ? new Date(dateOfBirth).toISOString().split('T')[0] : '';
      const stringToHash = `${securityPin}${phoneNumber}${dobString}`;
      const hashedPin = await bcrypt.hash(stringToHash, 10);

      // ---------------------------------------------------------
      // CREATE MEMBER
      // ---------------------------------------------------------
      const newMember = await Member.create({
        firstName,
        lastName,
        email: normalizedEmail,
        phoneNumber,
        address,
        dateOfBirth,
        gender,
        maritalStatus,
        occupation,
        interests,
        membershipType,
        ageGroup,
        emergencyContactName,
        emergencyContactPhone,
        emergencyContactRelationship,
        profilePicture,
        notes,
        memberSince: new Date(),
        securityPin: hashedPin, // ← store hashed version
        countryCode,
      });

      await MailHelper.sendMail({
        to: newMember.email,
        subject: "Welcome Onboard",
        template: "welcome",
        params: { ...newMember.dataValues, tempPin: securityPin },
      });

      return res.status(201).send({
        message: "Member created successfully",
        data: newMember
      });

    } catch (error) {
      console.error("Error creating member:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  // ✅ Create Child Member
  static async createChildMember(req, res) {
    try {
      const {
        parentId, // Optional: if not provided, will use parentEmail and parentPhoneNumber
        firstName,
        lastName,
        dateOfBirth,
        gender,
        membershipType,

      } = req.body;

      // Handle profile picture upload
      const profilePicture = req?.fileUrl;

      // Verify that the provided parentId exists
      const parentMember = await Member.findByPk(parentId);
      if (!parentMember) {
        return res.status(404).send({ message: "Parent member not found with provided ID" });
      }

      // Check if child with same name already exists for this parent
      const childExists = await Member.findOne({
        where: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          parentId: parentId
        }
      });

      if (childExists) {
        return res.status(409).send({
          message: `A child named ${firstName} ${lastName} already exists for this parent`
        });
      }

      // Calculate age group
      let ageGroup = null;
      if (dateOfBirth) {
        const dob = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          age--;
        }

        if (age < 10) {
          ageGroup = "children";
        } else if (age >= 10 && age <= 19) {
          ageGroup = "teenager";
        } else {
          ageGroup = "adult";
        }
      }

      // Hash the pin + phoneNumber + dateOfBirth
      const dobString = dateOfBirth ? new Date(dateOfBirth).toISOString().split('T')[0] : '';
      const stringToHash = `${process.env.DEFAULT_PIN}${parentMember.phoneNumber}${dobString}`;
      const hashedPin = await bcrypt.hash(stringToHash, 10);

      // Create child member with parentId
      const newChildMember = await Member.create({
        firstName,
        lastName,
        email: parentMember.email,
        phoneNumber: parentMember.phoneNumber,
        address: parentMember.address,
        countryCode: parentMember.countryCode,
        dateOfBirth,
        gender,
        maritalStatus: "single",
        occupation: "student",
        membershipType,
        ageGroup,
        emergencyContactName: parentMember.emergencyContactName,
        emergencyContactPhone: parentMember.emergencyContactPhone,
        emergencyContactRelationship: parentMember.emergencyContactRelationship,
        profilePicture,
        memberSince: new Date(),
        securityPin: hashedPin,
        parentId
      });

      await MailHelper.sendMail({
        to: newChildMember.email,
        subject: "Welcome Onboard",
        template: "welcome",
        params: { ...newChildMember.dataValues, tempPin: process.env.DEFAULT_PIN },
      });

      return res.status(201).send({
        message: "Child member created successfully",
        data: newChildMember
      });

    } catch (error) {
      console.error("Error creating child member:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }



  // ✅ Get Member Children
  static async getMemberChildren(req, res) {
    try {
      const { parentId } = req.query;

      if (!parentId) {
        return res.status(400).send({ message: "Parent ID is required" });
      }

      const children = await Member.findAll({
        where: { parentId },
        order: [["createdAt", "DESC"]]
      });

      return res.status(200).send({
        message: "Children fetched successfully",
        data: children
      });
    } catch (error) {
      console.error("Error fetching member children:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  // ✅ Lookup Member by Hash
  static async lookupMember(req, res) {
    try {
      const { phoneNumber, dateOfBirth, securityPin } = req.body;

      // 1. Find member by phone number
      const member = await Member.findOne({
        where: { phoneNumber: phoneNumber.trim() }
      });

      if (!member) {
        return res.status(404).send({ message: "Member not found" });
      }

      // 2. Reconstruct the string to verify: securityPin + phoneNumber + dobString
      // Note: We must use the same formatting logic as in createMember
      const dobString = dateOfBirth ? new Date(dateOfBirth).toISOString().split('T')[0] : '';
      const stringToVerify = `${securityPin}${phoneNumber}${dobString}`;

      // 3. Compare hash
      // member.securityPin stores the hash
      if (!member.securityPin) {
        // If for some reason securityPin is null (legacy records?), we can't verify.
        return res.status(404).send({ message: "Member not found or security pin not set" });
      }

      const isMatch = await bcrypt.compare(stringToVerify, member.securityPin);

      if (!isMatch) {
        return res.status(404).send({ message: "Member not found" }); // Generic error for security
      }

      // 4. Return member data
      return res.status(200).send({
        message: "Member verified successfully",
        data: member
      });

    } catch (error) {
      console.error("Error looking up member:", error);
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
