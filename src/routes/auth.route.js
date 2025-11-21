// src/routes/auth.route.js - INTEGRATED AUTH ROUTES
import express from "express";
import AuthController from "../controller/auth.controller";
import { handleErrorAsync } from "../middleware/error-handler.middleware";
import AuthMiddleware from "../middleware/auth.middleware";
import validateRequest from "../middleware/validate-request.middleware";
import AuthSchema from "../schema/auth";

const router = express.Router();

// ============================================
// PUBLIC ROUTES (No Authentication Required)
// ============================================

/**
 * @route   POST /api/v1/auth/admin/login
 * @desc    Admin login (Dashboard)
 * @access  Public
 */
router.post(
  "/admin/login",
  validateRequest(AuthSchema.adminLogin),
  handleErrorAsync(AuthController.adminLogin)
);

/**
 * @route   POST /api/v1/auth/admin/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post(
  "/admin/forgot-password",
  validateRequest(AuthSchema.adminForgotPassword),
  handleErrorAsync(AuthController.adminForgotPassword)
);

/**
 * @route   POST /api/v1/auth/admin/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post(
  "/admin/reset-password",
  validateRequest(AuthSchema.adminResetPassword),
  handleErrorAsync(AuthController.adminResetPassword)
);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
  "/refresh",
  handleErrorAsync(AuthController.refresh)
);

// ============================================
// PROTECTED ROUTES (Authentication Required)
// ============================================

/**
 * @route   GET /api/v1/auth/verify
 * @desc    Verify current token
 * @access  Protected
 */
router.get(
  "/verify",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthController.verify)
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout admin
 * @access  Protected
 */
router.post(
  "/logout",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthController.logout)
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current admin info
 * @access  Protected
 */
router.get(
  "/me",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthController.getCurrentAdmin)
);

/**
 * @route   PUT /api/v1/auth/admin/change-password
 * @desc    Change admin password
 * @access  Protected
 */
router.put(
  "/admin/change-password",
  handleErrorAsync(AuthMiddleware.verifyToken),
  validateRequest(AuthSchema.adminChangePassword),
  handleErrorAsync(AuthController.adminChangePassword)
);

export default router;