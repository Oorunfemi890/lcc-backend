import express from "express";
import CelebrantController from "../controller/celebrant.controller";
import { handleErrorAsync } from "../middleware/error-handler.middleware";
import AuthMiddleware from "../middleware/auth.middleware";
import  validateRequest  from "../middleware/validate-request.middleware";
import CelebrantSchema from "../schema/celebrant";
import ImageUploadMiddleware from '../middleware/image-upload.middleware'
const router = express.Router();

// ============================================
// PUBLIC ROUTES (No Authentication Required)
// ============================================

/**
 * @route   POST /api/celebrant
 * @desc    Create new celebrant (celebration registration)
 * @access  Public
 */
router.post(
  "/",
  validateRequest(CelebrantSchema.createCelebrant),
  ImageUploadMiddleware,
  handleErrorAsync(CelebrantController.createCelebrant)
);

/**
 * @route   GET /api/celebrant
 * @desc    Get all celebrants with pagination and filters
 * @access  Public
 * @query   page, limit, name, celebrationType, isPublic, active
 */
router.get(
  "/",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(CelebrantSchema.findAllCelebrants),
  handleErrorAsync(CelebrantController.findAllCelebrants)
);

// ============================================
// PROTECTED ROUTES (Admin Only)
// ============================================

/**
 * @route   PUT /api/celebrant/:id
 * @desc    Update celebrant details
 * @access  Protected (Admin)
 */
router.put(
  "/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(CelebrantSchema.updateCelebrant),
  handleErrorAsync(CelebrantController.updateCelebrant)
);

/**
 * @route   DELETE /api/celebrant/:id
 * @desc    Delete celebrant
 * @access  Protected (Admin)
 */
router.delete(
  "/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isSuperAdmin),
  validateRequest(CelebrantSchema.deleteCelebrant),
  handleErrorAsync(CelebrantController.deleteCelebrant)
);

export default router;