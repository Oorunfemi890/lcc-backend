// src/routes/admin-management.route.js - Admin Management Routes
import express from "express";
import AdminController from "../controller/admin.controller";
import { handleErrorAsync } from "../middleware/error-handler.middleware";
import AuthMiddleware from "../middleware/auth.middleware";
import validateRequest from "../middleware/validate-request.middleware";
import AdminSchema from "../schema/admin";

const router = express.Router();

// ============================================
// ALL ROUTES REQUIRE SUPER ADMIN ACCESS
// ============================================

/**
 * @route   GET /api/v1/admin-management
 * @desc    Get all admins with pagination and filters
 * @access  Protected (Super Admin only)
 * @query   page, limit, role, active, search
 */
router.get(
  "/",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isSuperAdmin),
  validateRequest(AdminSchema.adminGetAll),
  handleErrorAsync(AdminController.getAllAdmins)
);

/**
 * @route   POST /api/v1/admin-management
 * @desc    Create new admin from existing member
 * @access  Protected (Super Admin only)
 */
router.post(
  "/",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isSuperAdmin),
  validateRequest(AdminSchema.createAdmin),
  handleErrorAsync(AdminController.createAdmin)
);

/**
 * @route   GET /api/v1/admin-management/stats
 * @desc    Get admin statistics
 * @access  Protected (Super Admin only)
 */
router.get(
  "/stats",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isSuperAdmin),
  handleErrorAsync(AdminController.getAdminStats)
);

/**
 * @route   GET /api/v1/admin-management/:id
 * @desc    Get single admin by ID
 * @access  Protected (Super Admin only)
 */
router.get(
  "/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isSuperAdmin),
  validateRequest(AdminSchema.findAminById),
  handleErrorAsync(AdminController.getAdminById)
);

/**
 * @route   PUT /api/v1/admin-management/:id
 * @desc    Update admin role and active status
 * @access  Protected (Super Admin only)
 */
router.put(
  "/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isSuperAdmin),
  validateRequest(AdminSchema.updateAdmin),
  handleErrorAsync(AdminController.updateAdmin)
);

/**
 * @route   DELETE /api/v1/admin-management/:id
 * @desc    Delete/deactivate admin
 * @access  Protected (Super Admin only)
 */
router.delete(
  "/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isSuperAdmin),
  validateRequest(AdminSchema.deleteAdmin),
  handleErrorAsync(AdminController.deleteAdmin)
);

/**
 * @route   PUT /api/v1/admin-management/:id/password
 * @desc    Update admin password (Super Admin only)
 * @access  Protected (Super Admin only)
 */
router.put(
  "/:id/password",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isSuperAdmin),
  validateRequest(AdminSchema.updateAdminPassword),
  handleErrorAsync(AdminController.updateAdminPassword)
);

export default router;