import express from "express";
import FollowUpController from "../controller/follow-up.controller";
import { handleErrorAsync } from "../middleware/error-handler.middleware";
import AuthMiddleware from "../middleware/auth.middleware";
import  validateRequest  from "../middleware/validate-request.middleware";
import FollowUpSchema from "../schema/follow-up";

const router = express.Router();

// ============================================
// PROTECTED ROUTES (Admin Only)
// ============================================

/**
 * @route   POST /api/follow-up
 * @desc    Create new follow-up
 * @access  Protected (Admin)
 */
router.post(
  "/",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(FollowUpSchema.createFollowUp),
  handleErrorAsync(FollowUpController.createFollowUp)
);

/**
 * @route   GET /api/follow-up
 * @desc    Get all follow-ups with pagination and filters
 * @access  Protected (Admin)
 * @query   page, limit, status, followUpType, assignedToMemberId, firstTimerId, startDate, endDate
 */
router.get(
  "/",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(FollowUpSchema.getAllFollowUps),
  handleErrorAsync(FollowUpController.getAllFollowUps)
);

/**
 * @route   GET /api/follow-up/:id
 * @desc    Get single follow-up by ID
 * @access  Protected (Admin)
 */
router.get(
  "/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(FollowUpSchema.getFollowUpById),
  handleErrorAsync(FollowUpController.getFollowUpById)
);

/**
 * @route   PUT /api/follow-up/:id
 * @desc    Update follow-up details
 * @access  Protected (Admin)
 */
router.put(
  "/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(FollowUpSchema.updateFollowUp),
  handleErrorAsync(FollowUpController.updateFollowUp)
);

/**
 * @route   DELETE /api/follow-up/:id
 * @desc    Delete follow-up
 * @access  Protected (Admin)
 */
router.delete(
  "/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isSuperAdmin),
  validateRequest(FollowUpSchema.deleteFollowUp),
  handleErrorAsync(FollowUpController.deleteFollowUp)
);

export default router;