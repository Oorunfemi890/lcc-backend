import db from "../../models";
import App from "../helpers/index.helper";
import MailService from "../service/mail.service";
import { Op } from "sequelize";

const { AdminUser, Member } = db.AdminUser;

class AuthController {

  static async createAdmin(req, res) {
    try {
      const {
        memberId,
        firstName,
        lastName,
        password,
        phoneNumber,
        address,
        email,
        countryCode,
        role = "ADMIN",
      } = req.body;

      if (!email || !phoneNumber || !countryCode) {
        return res.status(409).send({
          message: "Missing Email{email}|Phonenumber{phoneNumber}|countryCode",
        });
      }

      // normalize phone number
      let newPhoneNumber =
        phoneNumber[0] === "0"
          ? phoneNumber.substring(1)
          : phoneNumber;

      // check if exists
      const userExists = await AdminUser.findOne({
        where: {
          [Op.or]: [{ phoneNumber: newPhoneNumber, countryCode }, { email }],
        },
      });
      if (userExists)
        return res.status(409).send({ message: "Email/Phonenumber exists" });

      // create member if not provided
      let finalMemberId = memberId;
      if (!finalMemberId) {
        const newMember = await Member.create({
          firstName,
          lastName,
          email,
          phoneNumber: newPhoneNumber,
          countryCode,
          address,
          memberSince: new Date(),
          active: true,
          membershipType: "Minister",
        });
        finalMemberId = newMember.id;
      }

      const hashPassword = App.hashPassword(password);

      const admin = await AdminUser.create(
        {
          email,
          firstName,
          lastName,
          password: hashPassword,
          phoneNumber: newPhoneNumber,
          address,
          countryCode,
          role,
          memberId: finalMemberId,
          active: true,
        },
        { raw: true }
      );

      // send welcome mail
      const mail = new MailService(
        "support@splishpay.com",
        email,
        "Welcome onBoard",
        "welcome",
        {}
      );
      await mail.send();

      const token = App.assignToken({
        id: admin.id,
        email: admin.email,
        role: admin.role,
      });

      res.status(201).send({ message: "Successful", user: { ...admin, token } });
    } catch (error) {
      console.log("error: ", error);
      res.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * Admin Login
   */
  static async adminLogin(req, res) {
    try {
      const { email, password } = req.body;
      const user = await AdminUser.findOne({ where: { email }, raw: true });
      if (!user)
        return res.status(404).send({ message: "Wrong email/password combination" });

      if (!App.isPasswordEqual(password, user.password))
        return res.status(404).send({ message: "Wrong email/password combination" });

      const token = App.assignToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return res.status(200).send({ user: { ...user, token } });
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * Admin Forgot Password
   */
  static async adminForgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await AdminUser.findOne({ where: { email } });
      if (!user)
        return res.status(404).send({ message: "Wrong email/User does not exist" });

      const token = App.assignToken({ id: user.id, email: user.email }, "30m");

      const mail = new MailService(
        "support@splishpay.com",
        user.email,
        "Password Recovery",
        "resetpassword",
        {
          token,
          CLIENT_URL: process.env.CLIENT_URL,
        }
      );
      await mail.send();

      return res
        .status(200)
        .send({ message: "check your email for password reset" });
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * Admin Reset Password
   */
  static async adminResetPassword(req, res) {
    try {
      const { newPassword } = req.body;
      const user = await AdminUser.findOne({ where: { id: req.user.id } });
      if (!user) return res.status(404).send({ message: "User not found" });

      if (!newPassword || newPassword.trim() === "")
        return res.status(406).send({ message: "newPassword is required" });

      const password = App.hashPassword(newPassword);
      await AdminUser.update({ password }, { where: { id: req.user.id } });

      res.status(200).send({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * Admin Change Password
   */
  static async adminChangePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = await AdminUser.findOne({
        where: { id: req.user.id },
        raw: true,
      });

      if (!App.isPasswordEqual(oldPassword, user.password))
        return res.status(404).send({ message: "invalid old password" });

      const password = App.hashPassword(newPassword);
      await AdminUser.update({ password }, { where: { id: req.user.id } });

      res.status(200).send({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * Edit Admin Profile
   */
  static async editAdminProfile(req, res) {
    try {
      const { phoneNumber, ...rest } = req.body;
      let newPhoneNumber =
        phoneNumber && phoneNumber[0] === "0"
          ? phoneNumber.substring(1)
          : phoneNumber;

      await AdminUser.update(
        { phoneNumber: newPhoneNumber, ...rest },
        { where: { id: req.user.id } }
      );

      res.status(200).send({ message: "profile updated successfully" });
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * Verify Admin Email
   */
  static async verifyAdminEmail(req, res) {
    try {
      const { email } = req.body;
      if (!email)
        return res.status(409).send({ message: "Missing Email{email}" });
      const userExits = await AdminUser.findOne({ where: { email } });
      return res.status(200).send({ data: !!userExits });
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  }

  static async createAdmin(req, res) {
    const t = await db.sequelize.transaction();
    try {
      const { memberId, role } = req.body;

      if (!memberId || !role) {
        return res.status(400).send({
          message: "Missing required fields: {memberId} {role}",
        });
      }

      const member = await Member.findOne({
        where: { id: memberId, active: true },
        attributes: ["id", "firstName", "lastName", "membershipType"],
        raw: true,
        transaction: t,
      });

      if (!member) {
        await t.rollback();
        return res.status(404).send({ message: "Member not found" });
      }

      const existingAdmin = await AdminUser.findOne({
        where: { memberId },
        transaction: t,
      });
      if (existingAdmin) {
        await t.rollback();
        return res.status(409).send({ message: "Admin already exists for this member" });
      }

      const admin = await AdminUser.create(
        {
          memberId: member.id,
          role: role.trim(),
          active: true,
        },
        { transaction: t }
      );

      await t.commit();

      return res.status(201).send({
        message: "Admin created successfully",
        data: {
          id: admin.id,
          role: admin.role,
          active: admin.active,
          member: {
            id: member.id,
            name: `${member.firstName} ${member.lastName}`,
            membershipType: member.membershipType,
          },
        },
      });
    } catch (error) {
      await t.rollback();
      console.error("Error creating admin:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  static async findAllAdmins(req, res) {
    try {
      let { page = 1, limit = 10, role, membershipType, active, search } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      const offset = (page - 1) * limit;

      const where = {};
      if (role) where.role = role;
      if (active !== undefined) where.active = active === "true";

      const memberWhere = {};
      if (membershipType) memberWhere.membershipType = membershipType;
      if (search) {
        memberWhere[Op.or] = [
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const { count, rows } = await AdminUser.findAndCountAll({
        where,
        include: [
          {
            model: Member,
            as: "member",
            attributes: ["id", "firstName", "lastName", "membershipType"],
            where: Object.keys(memberWhere).length ? memberWhere : undefined,
          },
        ],
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).send({
        message: "Admins fetched successfully",
        pagination: {
          total: count,
          page,
          pages: Math.ceil(count / limit),
          limit,
        },
        data: rows.map((admin) => ({
          id: admin.id,
          role: admin.role,
          active: admin.active,
          member: {
            id: admin.member.id,
            name: `${admin.member.firstName} ${admin.member.lastName}`,
            membershipType: admin.member.membershipType,
          },
        })),
      });
    } catch (error) {
      console.error("Error fetching admins:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  static async findOneAdmin(req, res) {
    try {
      const { id } = req.params;
      const admin = await AdminUser.findOne({
        where: { id },
        include: [
          {
            model: Member,
            as: "member",
            attributes: ["id", "firstName", "lastName", "membershipType"],
          },
        ],
      });

      if (!admin) {
        return res.status(404).send({ message: "Admin not found" });
      }

      return res.status(200).send({
        message: "Admin fetched successfully",
        data: {
          id: admin.id,
          role: admin.role,
          active: admin.active,
          member: {
            id: admin.member.id,
            name: `${admin.member.firstName} ${admin.member.lastName}`,
            membershipType: admin.member.membershipType,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching admin:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  static async updateAdmin(req, res) {
    try {
      const { id } = req.params;
      const { role, active } = req.body;

      const admin = await AdminUser.findByPk(id);
      if (!admin) {
        return res.status(404).send({ message: "Admin not found" });
      }

      await admin.update({ role, active });

      // refetch with member
      const updatedAdmin = await AdminUser.findOne({
        where: { id },
        include: [
          {
            model: Member,
            as: "member",
            attributes: ["id", "firstName", "lastName", "membershipType"],
          },
        ],
      });

      return res.status(200).send({
        message: "Admin updated successfully",
        data: {
          id: updatedAdmin.id,
          role: updatedAdmin.role,
          active: updatedAdmin.active,
          member: {
            id: updatedAdmin.member.id,
            name: `${updatedAdmin.member.firstName} ${updatedAdmin.member.lastName}`,
            membershipType: updatedAdmin.member.membershipType,
          },
        },
      });
    } catch (error) {
      console.error("Error updating admin:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  // ✅ Delete Admin
  static async deleteAdmin(req, res) {
    try {
      const { id } = req.params;
      const admin = await AdminUser.findByPk(id);

      if (!admin) {
        return res.status(404).send({ message: "Admin not found" });
      }

      await admin.destroy();
      return res.status(200).send({ message: "Admin deleted successfully" });
    } catch (error) {
      console.error("Error deleting admin:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }



}

export default AuthController;
