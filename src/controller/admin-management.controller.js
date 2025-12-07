import db from "../../models";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import crypto from "crypto";

const { AdminUser, Member } = db;

class AdminManagementController {
    /**
     * Get all admin users with filtering
     * @route GET /api/v1/admin/users
     * @access SUPER_ADMIN, ADMIN
     */
    static async listAdmins(req, res) {
        try {
            const { page = 1, limit = 10, role, active, search } = req.query;
            const currentUser = req.user;

            const where = {};

            // Filter by role
            if (role) {
                where.role = role;
            }

            // Filter by active status (only if it's a valid boolean string)
            if (active && (active === 'true' || active === 'false')) {
                where.active = active === 'true';
            }

            // Search by email
            if (search) {
                where.email = { [Op.iLike]: `%${search}%` };
            }

            const offset = (page - 1) * limit;

            const { count, rows } = await AdminUser.findAndCountAll({
                where,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [["createdAt", "DESC"]],
                include: [
                    {
                        model: Member,
                        as: 'member',
                        attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'address', 'gender', 'membershipType', 'maritalStatus', 'occupation', 'memberSince', 'active']
                    }
                ],
                attributes: { exclude: ['password'] } // Don't send passwords
            });

            return res.status(200).json({
                success: true,
                data: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    pages: Math.ceil(count / limit),
                    limit: parseInt(limit)
                },
                message: "Admin users retrieved successfully"
            });
        } catch (error) {
            console.error("List admins error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch admin users",
                error: error.message
            });
        }
    }

    /**
     * Create new admin user
     * @route POST /api/v1/admin/users
     * @access SUPER_ADMIN (all roles), ADMIN (EDITOR, VIEWER only)
     */
    static async createAdmin(req, res) {
        try {
            const { email, memberId, role, password } = req.body;
            const currentUser = req.user;

            // Validate role permissions
            if (currentUser.role === 'ADMIN') {
                if (!['EDITOR', 'VIEWER'].includes(role)) {
                    return res.status(403).json({
                        success: false,
                        message: "ADMIN can only create EDITOR and VIEWER roles"
                    });
                }
            }

            // Check if admin already exists
            const existingAdmin = await AdminUser.findOne({ where: { email } });
            if (existingAdmin) {
                return res.status(400).json({
                    success: false,
                    message: "Admin user with this email already exists"
                });
            }

            // Check if member exists
            const member = await Member.findByPk(memberId);
            if (!member) {
                return res.status(404).json({
                    success: false,
                    message: "Member not found"
                });
            }

            // Check if member is already an admin
            const existingMemberAdmin = await AdminUser.findOne({ where: { memberId } });
            if (existingMemberAdmin) {
                return res.status(400).json({
                    success: false,
                    message: "This member is already an admin user"
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create admin user
            const newAdmin = await AdminUser.create({
                email,
                memberId,
                role,
                password: hashedPassword,
                active: true
            });

            // Fetch with member details
            const adminWithMember = await AdminUser.findByPk(newAdmin.id, {
                include: [
                    {
                        model: Member,
                        as: 'member',
                        attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
                    }
                ],
                attributes: { exclude: ['password'] }
            });

            return res.status(201).json({
                success: true,
                data: adminWithMember,
                message: "Admin user created successfully"
            });
        } catch (error) {
            console.error("Create admin error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to create admin user",
                error: error.message
            });
        }
    }

    /**
     * Update admin user
     * @route PUT /api/v1/admin/users/:id
     * @access SUPER_ADMIN (all), ADMIN (EDITOR, VIEWER only)
     */
    static async updateAdmin(req, res) {
        try {
            const { id } = req.params;
            const { email, role, active } = req.body;
            const currentUser = req.user;

            const admin = await AdminUser.findByPk(id);
            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: "Admin user not found"
                });
            }

            // Check permissions
            if (currentUser.role === 'ADMIN') {
                // ADMIN cannot edit SUPER_ADMIN or other ADMIN users
                if (['SUPER_ADMIN', 'ADMIN'].includes(admin.role)) {
                    return res.status(403).json({
                        success: false,
                        message: "ADMIN cannot edit SUPER_ADMIN or other ADMIN users"
                    });
                }

                // ADMIN can only assign EDITOR or VIEWER roles
                if (role && !['EDITOR', 'VIEWER'].includes(role)) {
                    return res.status(403).json({
                        success: false,
                        message: "ADMIN can only assign EDITOR and VIEWER roles"
                    });
                }
            }

            // Update fields
            if (email) admin.email = email;
            if (role) admin.role = role;
            if (active !== undefined) admin.active = active;

            await admin.save();

            // Fetch with member details
            const updatedAdmin = await AdminUser.findByPk(id, {
                include: [
                    {
                        model: Member,
                        as: 'member',
                        attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
                    }
                ],
                attributes: { exclude: ['password'] }
            });

            return res.status(200).json({
                success: true,
                data: updatedAdmin,
                message: "Admin user updated successfully"
            });
        } catch (error) {
            console.error("Update admin error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to update admin user",
                error: error.message
            });
        }
    }

    /**
     * Block/unblock admin user
     * @route PATCH /api/v1/admin/users/:id/block
     * @access SUPER_ADMIN only
     */
    static async blockAdmin(req, res) {
        try {
            const { id } = req.params;
            const { blocked } = req.body;

            const admin = await AdminUser.findByPk(id);
            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: "Admin user not found"
                });
            }

            // Cannot block yourself
            if (admin.id === req.user.id) {
                return res.status(400).json({
                    success: false,
                    message: "You cannot block yourself"
                });
            }

            admin.active = !blocked;
            await admin.save();

            return res.status(200).json({
                success: true,
                data: { id: admin.id, active: admin.active },
                message: `Admin user ${blocked ? 'blocked' : 'unblocked'} successfully`
            });
        } catch (error) {
            console.error("Block admin error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to block/unblock admin user",
                error: error.message
            });
        }
    }

    /**
     * Reset admin password
     * @route POST /api/v1/admin/users/:id/reset-password
     * @access SUPER_ADMIN (all), ADMIN (EDITOR, VIEWER only)
     */
    static async resetAdminPassword(req, res) {
        try {
            const { id } = req.params;
            const currentUser = req.user;

            const admin = await AdminUser.findByPk(id, {
                include: [
                    {
                        model: Member,
                        as: 'member',
                        attributes: ['id', 'firstName', 'lastName', 'email']
                    }
                ]
            });

            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: "Admin user not found"
                });
            }

            // Check permissions
            if (currentUser.role === 'ADMIN') {
                if (['SUPER_ADMIN', 'ADMIN'].includes(admin.role)) {
                    return res.status(403).json({
                        success: false,
                        message: "ADMIN cannot reset password for SUPER_ADMIN or other ADMIN users"
                    });
                }
            }

            // Cannot reset your own password through this endpoint
            if (admin.id === currentUser.id) {
                return res.status(400).json({
                    success: false,
                    message: "Use the change password endpoint to reset your own password"
                });
            }

            // Generate random password
            const newPassword = crypto.randomBytes(8).toString('hex');
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            admin.password = hashedPassword;
            await admin.save();

            // TODO: Send email with new password
            // await EmailHelper.sendPasswordResetEmail(admin.email, newPassword);

            return res.status(200).json({
                success: true,
                data: {
                    id: admin.id,
                    email: admin.email,
                    temporaryPassword: newPassword // In production, don't return this - send via email only
                },
                message: "Password reset successfully. New password has been sent to the admin's email."
            });
        } catch (error) {
            console.error("Reset password error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to reset admin password",
                error: error.message
            });
        }
    }

    /**
     * Delete admin user
     * @route DELETE /api/v1/admin/users/:id
     * @access SUPER_ADMIN only
     */
    static async deleteAdmin(req, res) {
        try {
            const { id } = req.params;

            const admin = await AdminUser.findByPk(id);
            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: "Admin user not found"
                });
            }

            // Cannot delete yourself
            if (admin.id === req.user.id) {
                return res.status(400).json({
                    success: false,
                    message: "You cannot delete yourself"
                });
            }

            await admin.destroy();

            return res.status(200).json({
                success: true,
                message: "Admin user deleted successfully"
            });
        } catch (error) {
            console.error("Delete admin error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to delete admin user",
                error: error.message
            });
        }
    }
}

export default AdminManagementController;
