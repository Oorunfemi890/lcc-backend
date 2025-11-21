// src/controller/auth.controller.js - COMPLETE INTEGRATED VERSION
import db from "../../models";
import App from "../helpers/index.helper";
import MailHelper from "../helpers/email.helper";
import { Op } from "sequelize";
import { logger } from '../logger/winston';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const { AdminUser, Member } = db;

// Helper function to generate tokens
const generateTokens = (adminId, email, role) => {
  const accessToken = jwt.sign(
    { adminId, id: adminId, email, role },
    process.env.JWT_SECRET || "charlesisawesome",
    { expiresIn: process.env.JWT_EXPIRE || "24h" }
  );

  const refreshToken = jwt.sign(
    { adminId, id: adminId },
    process.env.JWT_REFRESH_SECRET || "charlesisawesome_refresh",
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d" }
  );

  return { accessToken, refreshToken };
};

// Helper function to generate secure token
const generateSecureToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

class AuthController {
  
  // ==========================================
  // ADMIN LOGIN (Dashboard)
  // ==========================================
  static async adminLogin(req, res) {
    try {
      const { email, password } = req.body;
      
      // Find admin by email
      const admin = await AdminUser.findOne({
        where: {
          email: email.toLowerCase(),
          active: true,
        },
        include: [
          {
            model: Member,
            as: "member",
            attributes: ["id", "firstName", "lastName", "email", "phoneNumber", "membershipType", "profilePicture"],
          },
        ],
      });

      if (!admin) {
        logger.warn(`Failed login attempt for email: ${email}`);
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Validate password using existing helper
      const isPasswordValid = App.isPasswordEqual(password, admin.password);
      if (!isPasswordValid) {
        logger.warn(`Failed login attempt for admin: ${email}`);
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(admin.id, admin.email, admin.role);

      // Update admin with refresh token and last login
      await admin.update({
        refreshToken,
        lastLogin: new Date(),
      });

      logger.info(`Admin login successful: ${admin.email} (${admin.id})`);

      // Return user data with token
      const userData = {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        active: admin.active,
        member: admin.member ? {
          id: admin.member.id,
          name: `${admin.member.firstName} ${admin.member.lastName}`,
          email: admin.member.email,
          phone: admin.member.phoneNumber,
          membershipType: admin.member.membershipType,
          profilePicture: admin.member.profilePicture,
        } : null,
      };

      res.json({
        success: true,
        message: "Login successful",
        user: { ...userData, token: accessToken },
        data: {
          user: userData,
          admin: userData,
          accessToken,
          token: accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      logger.error("Admin login error:", error);
      res.status(500).json({
        success: false,
        message: "Login failed. Please try again.",
      });
    }
  }

  // ==========================================
  // REFRESH TOKEN
  // ==========================================
  static async refresh(req, res) {
    try {
      const authHeader = req.headers["authorization"];
      const refreshToken = authHeader && authHeader.split(" ")[1];

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Refresh token is required",
        });
      }

      // Verify refresh token
      let decoded;
      try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "charlesisawesome_refresh");
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
      }

      // Get admin from database
      const admin = await AdminUser.findByPk(decoded.adminId || decoded.id, {
        include: [
          {
            model: Member,
            as: "member",
            attributes: ["id", "firstName", "lastName", "email", "phoneNumber", "membershipType"],
          },
        ],
      });

      if (!admin || !admin.active || admin.refreshToken !== refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
      }

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(
        admin.id,
        admin.email,
        admin.role
      );

      // Update admin with new refresh token
      await admin.update({ refreshToken: newRefreshToken });

      const userData = {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        active: admin.active,
        member: admin.member ? {
          id: admin.member.id,
          name: `${admin.member.firstName} ${admin.member.lastName}`,
          email: admin.member.email,
          phone: admin.member.phoneNumber,
          membershipType: admin.member.membershipType,
        } : null,
      };

      res.json({
        success: true,
        message: "Token refreshed successfully",
        data: {
          user: userData,
          admin: userData,
          accessToken,
          token: accessToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (error) {
      logger.error("Token refresh error:", error);
      res.status(500).json({
        success: false,
        message: "Token refresh failed",
      });
    }
  }

  // ==========================================
  // VERIFY TOKEN
  // ==========================================
  static async verify(req, res) {
    try {
      const admin = await AdminUser.findByPk(req.user.id, {
        include: [
          {
            model: Member,
            as: "member",
            attributes: ["id", "firstName", "lastName", "email", "phoneNumber", "membershipType"],
          },
        ],
      });

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      const userData = {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        active: admin.active,
        member: admin.member ? {
          id: admin.member.id,
          name: `${admin.member.firstName} ${admin.member.lastName}`,
          email: admin.member.email,
          phone: admin.member.phoneNumber,
          membershipType: admin.member.membershipType,
        } : null,
      };

      res.json({
        success: true,
        message: "Token is valid",
        data: {
          user: userData,
          admin: userData,
          valid: true,
        },
      });
    } catch (error) {
      logger.error("Token verification error:", error);
      res.status(500).json({
        success: false,
        message: "Token verification failed",
      });
    }
  }

  // ==========================================
  // LOGOUT
  // ==========================================
  static async logout(req, res) {
    try {
      // Clear refresh token
      await AdminUser.update(
        { refreshToken: null },
        { where: { id: req.user.id } }
      );

      logger.info(`Admin logout: ${req.user.email} (${req.user.id})`);

      res.json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      logger.error("Logout error:", error);
      res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }
  }

  // ==========================================
  // GET CURRENT ADMIN
  // ==========================================
  static async getCurrentAdmin(req, res) {
    try {
      const admin = await AdminUser.findByPk(req.user.id, {
        attributes: { exclude: ["password", "refreshToken"] },
        include: [
          {
            model: Member,
            as: "member",
            attributes: ["id", "firstName", "lastName", "email", "phoneNumber", "membershipType", "profilePicture"],
          },
        ],
      });

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      const userData = {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        active: admin.active,
        member: admin.member ? {
          id: admin.member.id,
          name: `${admin.member.firstName} ${admin.member.lastName}`,
          email: admin.member.email,
          phone: admin.member.phoneNumber,
          membershipType: admin.member.membershipType,
          profilePicture: admin.member.profilePicture,
        } : null,
      };

      res.json({
        success: true,
        message: "Admin information retrieved successfully",
        data: {
          user: userData,
          admin: userData,
        },
      });
    } catch (error) {
      logger.error("Get current admin error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get admin information",
      });
    }
  }

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================
  static async adminChangePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;

      const admin = await AdminUser.findByPk(req.user.id);
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      // Verify old password
      const isPasswordValid = App.isPasswordEqual(oldPassword, admin.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Update password
      const hashedPassword = App.hashPassword(newPassword);
      await admin.update({
        password: hashedPassword,
        refreshToken: null, // Invalidate all sessions
      });

      logger.info(`Password changed successfully for admin: ${admin.email}`);

      res.json({
        success: true,
        message: "Password changed successfully. Please log in again.",
      });
    } catch (error) {
      logger.error("Change password error:", error);
      res.status(500).json({
        success: false,
        message: "Password change failed",
      });
    }
  }

  // ==========================================
  // FORGOT PASSWORD
  // ==========================================
  static async adminForgotPassword(req, res) {
    try {
      const { email } = req.body;

      const admin = await AdminUser.findOne({
        where: {
          email: email.toLowerCase(),
          active: true,
        },
      });

      // Always return success to prevent email enumeration
      if (!admin) {
        return res.json({
          success: true,
          message: "If an account with that email exists, a password reset link has been sent.",
        });
      }

      // Generate password reset token
      const resetToken = generateSecureToken();
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await admin.update({
        passwordResetToken: resetToken,
        passwordResetExpires: resetTokenExpiry,
      });

      // Send password reset email
      try {
        await MailHelper.sendMail({
          to: admin.email,
          subject: "Password Reset Request",
          template: "reset-password",
          params: {
            name: admin.member?.firstName || "Admin",
            resetToken,
            resetUrl: `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`,
          },
        });
      } catch (emailError) {
        logger.error("Failed to send password reset email:", emailError);
      }

      logger.info(`Password reset requested for: ${admin.email}`);

      res.json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent.",
      });
    } catch (error) {
      logger.error("Forgot password error:", error);
      res.status(500).json({
        success: false,
        message: "Password reset request failed",
      });
    }
  }

  // ==========================================
  // RESET PASSWORD
  // ==========================================
  static async adminResetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      const admin = await AdminUser.findOne({
        where: {
          passwordResetToken: token,
          active: true,
        },
      });

      if (!admin || !admin.passwordResetExpires || admin.passwordResetExpires < new Date()) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired reset token",
        });
      }

      // Update password
      const hashedPassword = App.hashPassword(newPassword);
      await admin.update({
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        refreshToken: null,
      });

      logger.info(`Password reset successful for: ${admin.email}`);

      res.json({
        success: true,
        message: "Password reset successful. You can now log in with your new password.",
      });
    } catch (error) {
      logger.error("Reset password error:", error);
      res.status(500).json({
        success: false,
        message: "Password reset failed",
      });
    }
  }

  // ==========================================
  // EXISTING LCC METHODS (Keep for backward compatibility)
  // ==========================================
  
  static async createAdmin(req, res) {
    const t = await db.sequelize.transaction();
    try {
      const { memberId, role, password } = req.body;

      if (!memberId || !role) {
        await t.rollback();
        return res.status(400).send({
          message: "Missing required fields: {memberId} {role}",
        });
      }

      const member = await Member.findOne({
        where: { id: memberId, active: true },
        attributes: ["id", "firstName", "lastName", "email", "membershipType"],
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

      // Hash password
      const hashedPassword = password ? App.hashPassword(password) : App.hashPassword("changeme123");

      const admin = await AdminUser.create(
        {
          memberId: member.id,
          email: member.email,
          password: hashedPassword,
          role: role.trim(),
          active: true,
        },
        { transaction: t }
      );

      await t.commit();

      // Send welcome email
      try {
        await MailHelper.sendMail({
          to: member.email,
          subject: "Admin Welcome onBoard",
          template: "welcome",
          params: member,
        });
      } catch (emailError) {
        logger.error("Failed to send welcome email:", emailError);
      }

      const token = App.assignToken({
        id: admin.id,
        email: admin.email,
        role: admin.role,
      });

      return res.status(201).send({
        message: "Admin created successfully",
        user: { ...admin.get({ plain: true }), token },
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
      logger.error("Error creating admin:", error);
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
            attributes: ["id", "firstName", "lastName", "membershipType", "email"],
            where: Object.keys(memberWhere).length ? memberWhere : undefined,
          },
        ],
        limit,
        offset,
        order: [["createdAt", "DESC"]],
        attributes: { exclude: ["password", "refreshToken"] },
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
          email: admin.email,
          role: admin.role,
          active: admin.active,
          member: admin.member ? {
            id: admin.member.id,
            name: `${admin.member.firstName} ${admin.member.lastName}`,
            membershipType: admin.member.membershipType,
          } : null,
        })),
      });
    } catch (error) {
      logger.error("Error fetching admins:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  static async findOneAdmin(req, res) {
    try {
      const { id } = req.params;
      const admin = await AdminUser.findOne({
        where: { id },
        attributes: { exclude: ["password", "refreshToken"] },
        include: [
          {
            model: Member,
            as: "member",
            attributes: ["id", "firstName", "lastName", "membershipType", "email"],
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
          email: admin.email,
          role: admin.role,
          active: admin.active,
          member: admin.member ? {
            id: admin.member.id,
            name: `${admin.member.firstName} ${admin.member.lastName}`,
            membershipType: admin.member.membershipType,
          } : null,
        },
      });
    } catch (error) {
      logger.error("Error fetching admin:", error);
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

      // Refetch with member
      const updatedAdmin = await AdminUser.findOne({
        where: { id },
        attributes: { exclude: ["password", "refreshToken"] },
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
          member: updatedAdmin.member ? {
            id: updatedAdmin.member.id,
            name: `${updatedAdmin.member.firstName} ${updatedAdmin.member.lastName}`,
            membershipType: updatedAdmin.member.membershipType,
          } : null,
        },
      });
    } catch (error) {
      logger.error("Error updating admin:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

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
      logger.error("Error deleting admin:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

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
      logger.error("Error updating profile:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  }

  static async verifyAdminEmail(req, res) {
    try {
      const { email } = req.body;
      if (!email)
        return res.status(409).send({ message: "Missing Email{email}" });
      const userExists = await AdminUser.findOne({ where: { email } });
      return res.status(200).send({ data: !!userExists });
    } catch (error) {
      logger.error("Error verifying email:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  }
}

export default AuthController;