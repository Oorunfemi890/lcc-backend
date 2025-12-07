import express from "express";
import AdminManagementController from "../controller/admin-management.controller";
import { handleErrorAsync } from "../middleware/error-handler.middleware";
import AuthMiddleware from "../middleware/auth.middleware";
import validateRequest from "../middleware/validate-request.middleware";
import AdminManagementSchema from "../schema/admin-management.schema";

const router = express.Router();

// ============================================
// ADMIN MANAGEMENT ROUTES
// All routes require authentication
// ============================================

/**
 * @route   GET /api/v1/admin/users
 * @desc    Get all admin users with filtering
 * @access  SUPER_ADMIN, ADMIN
 */
router.get(
    "/users",
    handleErrorAsync(AuthMiddleware.verifyToken),
    handleErrorAsync(AuthMiddleware.isAdmin),
    validateRequest(AdminManagementSchema.listAdmins),
    handleErrorAsync(AdminManagementController.listAdmins)
);

/**
 * @route   POST /api/v1/admin/users
 * @desc    Create new admin user
 * @access  SUPER_ADMIN (all roles), ADMIN (EDITOR, VIEWER only)
 */
router.post(
    "/users",
    handleErrorAsync(AuthMiddleware.verifyToken),
    handleErrorAsync(AuthMiddleware.isAdmin),
    validateRequest(AdminManagementSchema.createAdmin),
    handleErrorAsync(AdminManagementController.createAdmin)
);

/**
 * @route   PUT /api/v1/admin/users/:id
 * @desc    Update admin user
 * @access  SUPER_ADMIN (all), ADMIN (EDITOR, VIEWER only)
 */
router.put(
    "/users/:id",
    handleErrorAsync(AuthMiddleware.verifyToken),
    handleErrorAsync(AuthMiddleware.isAdmin),
    validateRequest(AdminManagementSchema.updateAdmin),
    handleErrorAsync(AdminManagementController.updateAdmin)
);

/**
 * @route   PATCH /api/v1/admin/users/:id/block
 * @desc    Block/unblock admin user
 * @access  SUPER_ADMIN only
 */
router.patch(
    "/users/:id/block",
    handleErrorAsync(AuthMiddleware.verifyToken),
    handleErrorAsync(AuthMiddleware.isSuperAdmin),
    validateRequest(AdminManagementSchema.blockAdmin),
    handleErrorAsync(AdminManagementController.blockAdmin)
);

/**
 * @route   POST /api/v1/admin/users/:id/reset-password
 * @desc    Reset admin password
 * @access  SUPER_ADMIN (all), ADMIN (EDITOR, VIEWER only)
 */
router.post(
    "/users/:id/reset-password",
    handleErrorAsync(AuthMiddleware.verifyToken),
    handleErrorAsync(AuthMiddleware.isAdmin),
    validateRequest(AdminManagementSchema.resetPassword),
    handleErrorAsync(AdminManagementController.resetAdminPassword)
);

/**
 * @route   DELETE /api/v1/admin/users/:id
 * @desc    Delete admin user
 * @access  SUPER_ADMIN only
 */
router.delete(
    "/users/:id",
    handleErrorAsync(AuthMiddleware.verifyToken),
    handleErrorAsync(AuthMiddleware.isSuperAdmin),
    validateRequest(AdminManagementSchema.deleteAdmin),
    handleErrorAsync(AdminManagementController.deleteAdmin)
);

export default router;
