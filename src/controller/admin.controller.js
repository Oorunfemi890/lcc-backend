// src/controller/admin.controller.js - Admin Management (Super Admin Only)
import { logger } from "../logger/winston";
import db from "../../models";
import App from "../helpers/index.helper";
import { Op } from "sequelize";

const { AdminUser, Member } = db;

class AdminController {
  // ==========================================
  // GET ALL ADMINS (Super Admin Only)
  // ==========================================
  static async getAllAdmins(req, res) {
    try {
      const { page = 1, limit = 10, role, active, search } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const where = {};
      if (role) where.role = role;
      if (active !== undefined) where.active = active === "true";

      const memberWhere = {};
      if (search) {
        memberWhere[Op.or] = [
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const { count, rows } = await AdminUser.findAndCountAll({
        where,
        include: [
          {
            model: Member,
            as: "member",
            attributes: ["id", "firstName", "lastName", "email", "phoneNumber", "membershipType", "profilePicture"],
            where: Object.keys(memberWhere).length ? memberWhere : undefined,
          },
        ],
        limit: parseInt(limit),
        offset,
        order: [["createdAt", "DESC"]],
        attributes: { exclude: ["password", "refreshToken"] },
      });

      const admins = rows.map(admin => ({
        id: admin.id,
        email: admin.email,
        role: admin.role,
        active: admin.active,
        createdAt: admin.createdAt,
        lastLogin: admin.lastLogin,
        member: admin.member ? {
          id: admin.member.id,
          name: `${admin.member.firstName} ${admin.member.lastName}`,
          email: admin.member.email,
          phone: admin.member.phoneNumber,
          membershipType: admin.member.membershipType,
          profilePicture: admin.member.profilePicture,
        } : null,
      }));

      res.json({
        success: true,
        message: "Admins retrieved successfully",
        data: admins,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit),
          limit: parseInt(limit),
        },
      });
    } catch (error) {
      logger.error("Get admins error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve admins",
      });
    }
  }

  // ==========================================
  // CREATE ADMIN (Super Admin Only)
  // ==========================================
  static async createAdmin(req, res) {
    try {
      const { memberId, role = "ADMIN", password } = req.body;

      // Check if member exists
      const member = await Member.findByPk(memberId);
      if (!member) {
        return res.status(404).json({
          success: false,
          message: "Member not found",
        });
      }

      // Check if admin already exists for this member
      const existingAdmin = await AdminUser.findOne({
        where: { memberId },
      });

      if (existingAdmin) {
        return res.status(409).json({
          success: false,
          message: "Admin already exists for this member",
        });
      }

      // Hash password
      const hashedPassword = password ? App.hashPassword(password) : App.hashPassword("changeme123");

      // Create admin
      const admin = await AdminUser.create({
        memberId,
        email: member.email,
        password: hashedPassword,
        role: role.trim(),
        active: true,
      });

      logger.info(`Admin created: ${member.email} by ${req.user.email}`);

      res.status(201).json({
        success: true,
        message: "Admin created successfully",
        data: {
          id: admin.id,
          email: admin.email,
          role: admin.role,
          active: admin.active,
          member: {
            id: member.id,
            name: `${member.firstName} ${member.lastName}`,
            email: member.email,
            membershipType: member.membershipType,
          },
        },
      });
    } catch (error) {
      logger.error("Create admin error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create admin",
      });
    }
  }

  // ==========================================
  // GET SINGLE ADMIN
  // ==========================================
  static async getAdminById(req, res) {
    try {
      const { id } = req.params;

      const admin = await AdminUser.findByPk(id, {
        attributes: { exclude: ["password", "refreshToken"] },
        include: [
          {
            model: Member,
            as: "member",
            attributes: ["id", "firstName", "lastName", "email", "phoneNumber", "membershipType", "profilePicture", "address"],
          },
        ],
      });

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      const adminData = {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        active: admin.active,
        createdAt: admin.createdAt,
        lastLogin: admin.lastLogin,
        member: admin.member ? {
          id: admin.member.id,
          name: `${admin.member.firstName} ${admin.member.lastName}`,
          email: admin.member.email,
          phone: admin.member.phoneNumber,
          membershipType: admin.member.membershipType,
          profilePicture: admin.member.profilePicture,
          address: admin.member.address,
        } : null,
      };

      res.json({
        success: true,
        message: "Admin retrieved successfully",
        data: adminData,
      });
    } catch (error) {
      logger.error("Get admin by ID error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve admin",
      });
    }
  }

  // ==========================================
  // UPDATE ADMIN
  // ==========================================
  static async updateAdmin(req, res) {
    try {
      const { id } = req.params;
      const { role, active } = req.body;

      const admin = await AdminUser.findByPk(id);
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      // Prevent deactivating or demoting the last super admin
      if (admin.role === "SUPER_ADMIN" && (active === false || (role && role !== "SUPER_ADMIN"))) {
        const superAdminCount = await AdminUser.count({
          where: { role: "SUPER_ADMIN", active: true },
        });

        if (superAdminCount <= 1) {
          return res.status(400).json({
            success: false,
            message: "Cannot deactivate or demote the last super admin",
          });
        }
      }

      // Update admin
      await admin.update({
        role: role || admin.role,
        active: active !== undefined ? active : admin.active,
      });

      logger.info(`Admin updated: ${admin.email} by ${req.user.email}`);

      // Reload with member data
      await admin.reload({
        include: [
          {
            model: Member,
            as: "member",
            attributes: ["id", "firstName", "lastName", "email", "phoneNumber", "membershipType"],
          },
        ],
      });

      res.json({
        success: true,
        message: "Admin updated successfully",
        data: {
          id: admin.id,
          email: admin.email,
          role: admin.role,
          active: admin.active,
          member: admin.member ? {
            id: admin.member.id,
            name: `${admin.member.firstName} ${admin.member.lastName}`,
            email: admin.member.email,
            membershipType: admin.member.membershipType,
          } : null,
        },
      });
    } catch (error) {
      logger.error("Update admin error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update admin",
      });
    }
  }

  // ==========================================
  // DELETE ADMIN
  // ==========================================
  static async deleteAdmin(req, res) {
    try {
      const { id } = req.params;

      const admin = await AdminUser.findByPk(id);
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      // Prevent deleting self
      if (admin.id === req.user.id) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete your own account",
        });
      }

      // Prevent deleting the last super admin
      if (admin.role === "SUPER_ADMIN") {
        const superAdminCount = await AdminUser.count({
          where: { role: "SUPER_ADMIN", active: true },
        });

        if (superAdminCount <= 1) {
          return res.status(400).json({
            success: false,
            message: "Cannot delete the last super admin",
          });
        }
      }

      const adminInfo = {
        email: admin.email,
        id: admin.id,
      };

      // Soft delete by setting inactive
      await admin.update({ active: false, refreshToken: null });

      logger.info(`Admin deleted: ${adminInfo.email} by ${req.user.email}`);

      res.json({
        success: true,
        message: "Admin deleted successfully",
        data: { id: adminInfo.id },
      });
    } catch (error) {
      logger.error("Delete admin error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete admin",
      });
    }
  }

  // ==========================================
  // UPDATE ADMIN PASSWORD (Super Admin Only)
  // ==========================================
  static async updateAdminPassword(req, res) {
    try {
      const { id } = req.params;
      const { password } = req.body;

      const admin = await AdminUser.findByPk(id);
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      // Hash new password
      const hashedPassword = App.hashPassword(password);

      // Update password and invalidate sessions
      await admin.update({
        password: hashedPassword,
        refreshToken: null,
      });

      logger.info(`Admin password updated: ${admin.email} by ${req.user.email}`);

      res.json({
        success: true,
        message: "Admin password updated successfully",
      });
    } catch (error) {
      logger.error("Update admin password error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update admin password",
      });
    }
  }

  // ==========================================
  // GET ADMIN STATISTICS
  // ==========================================
  static async getAdminStats(req, res) {
    try {
      const totalAdmins = await AdminUser.count();
      const activeAdmins = await AdminUser.count({ where: { active: true } });
      const inactiveAdmins = await AdminUser.count({ where: { active: false } });
      const superAdmins = await AdminUser.count({ where: { role: "SUPER_ADMIN", active: true } });
      const regularAdmins = await AdminUser.count({ where: { role: "ADMIN", active: true } });

      res.json({
        success: true,
        message: "Admin statistics retrieved successfully",
        data: {
          total: totalAdmins,
          active: activeAdmins,
          inactive: inactiveAdmins,
          superAdmins,
          regularAdmins,
        },
      });
    } catch (error) {
      logger.error("Get admin stats error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve admin statistics",
      });
    }
  }
}

export default AdminController;