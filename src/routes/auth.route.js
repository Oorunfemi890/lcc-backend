import express from "express";
import AuthController from "../controller/auth.controller";
import { handleErrorAsync } from "../middleware/error-handler.middleware";
import AuthMiddleware from "../middleware/auth.middleware";
import  validateRequest  from "../middleware/validate-request.middleware";
import AuthSchema from "../schema/auth";

const router = express.Router();

// ============================================
// PUBLIC ROUTES (No Authentication Required)
// ============================================

/**
 * @route   POST /api/auth/admin/login
 * @desc    Admin login
 * @access  Public
 */
router.post(
  "/admin/login",
  validateRequest(AuthSchema.adminLogin),
  handleErrorAsync(AuthController.adminLogin)
);

/**
 * @route   POST /api/auth/admin/forgot-password
 * @desc    Admin forgot password - sends reset email
 * @access  Public
 */
router.post(
  "/admin/forgot-password",
  validateRequest(AuthSchema.adminForgotPassword),
  handleErrorAsync(AuthController.adminForgotPassword)
);

/**
 * @route   POST /api/auth/admin/verify-email
 * @desc    Verify if admin email exists
 * @access  Public
 */
// router.post(
//   "/admin/verify-email",
//   validateRequest(AuthSchema.verifyEmailSchema),
//   handleErrorAsync(AuthController.verifyAdminEmail)
// );

// ============================================
// PROTECTED ROUTES (Authentication Required)
// ============================================

/**
 * @route   POST /api/auth/admin/reset-password
 * @desc    Reset admin password (requires reset token)
 * @access  Protected (with reset token)
 */
router.post(
  "/admin/reset-password",
  handleErrorAsync(AuthMiddleware.verifyToken),
  validateRequest(AuthSchema.adminResetPassword),
  handleErrorAsync(AuthController.adminResetPassword)
);

/**
 * @route   PUT /api/auth/admin/change-password
 * @desc    Change admin password (requires old password)
 * @access  Protected
 */
router.put(
  "/admin/change-password",
  handleErrorAsync(AuthMiddleware.verifyToken),
  validateRequest(AuthSchema.adminChangePassword),
  handleErrorAsync(AuthController.adminChangePassword)
);

// ============================================
// ADMIN MANAGEMENT ROUTES (Super Admin Only)
// ============================================

/**
 * @route   POST /api/auth/admin
 * @desc    Create new admin from existing member
 * @access  Protected (Super Admin only)
 */
router.post(
  "/admin",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isSuperAdmin),
  validateRequest(AuthSchema.createAdmin),
  handleErrorAsync(AuthController.createAdmin)
);

/**
 * @route   GET /api/auth/admin
 * @desc    Get all admins with pagination and filters
 * @access  Protected (Super Admin only)
 * @query   page, limit, role, membershipType, active, search
 */
router.get(
  "/admin",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isSuperAdmin),
  validateRequest(AuthSchema.adminFindAllSchema),
  handleErrorAsync(AuthController.findAllAdmins)
);

/**
 * @route   GET /api/auth/admin/:id
 * @desc    Get single admin by ID
 * @access  Protected (Super Admin only)
 */
router.get(
  "/admin/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isSuperAdmin),
  validateRequest(AuthSchema.findAminById),
  handleErrorAsync(AuthController.findOneAdmin)
);

/**
 * @route   PUT /api/auth/admin/:id
 * @desc    Update admin role and active status
 * @access  Protected (Super Admin only)
 */
router.put(
  "/admin/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isSuperAdmin),
  validateRequest(AuthSchema.adminResetProfile),
  handleErrorAsync(AuthController.updateAdmin)
);

/**
 * @route   DELETE /api/auth/admin/:id
 * @desc    Delete admin
 * @access  Protected (Super Admin only)
 */
router.delete(
  "/admin/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isSuperAdmin),
  validateRequest(AuthSchema.deleteAdmin),
  handleErrorAsync(AuthController.deleteAdmin)
);

export default router;