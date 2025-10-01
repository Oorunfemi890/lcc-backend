import express from "express";
import FirstTimerController from "../controller/first-timer.controller";
import { handleErrorAsync } from "../middleware/error-handler.middleware";
import AuthMiddleware from "../middleware/auth.middleware";
import  validateRequest  from "../middleware/validate-request.middleware";
import FirstTimerSchema from "../schema/first-timer";

const router = express.Router();

// ============================================
// PUBLIC ROUTES (No Authentication Required)
// ============================================

/**
 * @route   POST /api/first-timer
 * @desc    Create new first timer
 * @access  Public
 */
router.post(
  "/",
  validateRequest(FirstTimerSchema.createFirstTimer),
  handleErrorAsync(FirstTimerController.createFirstTimer)
);

// ============================================
// PROTECTED ROUTES (Admin Only)
// ============================================

/**
 * @route   GET /api/first-timer
 * @desc    Get all first timers with pagination and filters
 * @access  Protected (Admin)
 * @query   page, limit, maritalStatus, ageGroup, visitDate, startDate, endDate, interestedInJoining
 */
router.get(
  "/",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(FirstTimerSchema.getAllFirstTimers),
  handleErrorAsync(FirstTimerController.getAllFirstTimers)
);

/**
 * @route   GET /api/first-timer/:id
 * @desc    Get single first timer by ID
 * @access  Protected (Admin)
 */
router.get(
  "/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(FirstTimerSchema.getFirstTimer),
  handleErrorAsync(FirstTimerController.getFirstTimer)
);

/**
 * @route   PUT /api/first-timer/:id
 * @desc    Update first timer details
 * @access  Protected (Admin)
 */
router.put(
  "/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(FirstTimerSchema.updateFirstTimer),
  handleErrorAsync(FirstTimerController.updateFirstTimer)
);

/**
 * @route   DELETE /api/first-timer/:id
 * @desc    Delete first timer
 * @access  Protected (Admin)
 */
router.delete(
  "/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isSuperAdmin),
  validateRequest(FirstTimerSchema.deleteFirstTimer),
  handleErrorAsync(FirstTimerController.deleteFirstTimer)
);

export default router;