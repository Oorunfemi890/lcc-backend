import express from "express";
import TestimonyController from "../controller/testimies.controller";
import { handleErrorAsync } from "../middleware/error-handler.middleware";
import AuthMiddleware from "../middleware/auth.middleware";
import  validateRequest  from "../middleware/validate-request.middleware";
import TestimonySchema from "../schema/testimony";

const router = express.Router();

// ============================================
// PROTECTED ROUTES (Admin Only)
// ============================================

/**
 * @route   POST /api/testimony
 * @desc    Create new testimony
 * @access  Protected (Admin)
 */
router.post(
  "/",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(TestimonySchema.testimonyCreate),
  handleErrorAsync(TestimonyController.createTestimony)
);

/**
 * @route   GET /api/testimony
 * @desc    Get all testimonies with pagination and filters
 * @access  Protected (Admin)
 * @query   page, limit, category, isPublic, sharedInService, active, memberId, content
 */
router.get(
  "/",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(TestimonySchema.testimonyGetAll),
  handleErrorAsync(TestimonyController.findAllTestimonies)
);

/**
 * @route   GET /api/testimony/:id
 * @desc    Get single testimony by ID
 * @access  Protected (Admin)
 */
router.get(
  "/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(TestimonySchema.testimonyById),
  handleErrorAsync(TestimonyController.findOneTestimony)
);

/**
 * @route   PUT /api/testimony/:id
 * @desc    Update testimony details
 * @access  Protected (Admin)
 */
router.put(
  "/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(TestimonySchema.testimonyUpdate),
  handleErrorAsync(TestimonyController.updateTestimony)
);


export default router;