import express from "express";
import TestimonyController from "../controller/testimies.controller";
import { handleErrorAsync } from "../middleware/error-handler.middleware";
import AuthMiddleware from "../middleware/auth.middleware";
import  validateRequest  from "../middleware/validate-request.middleware";
import TestimonySchema from "../schema/testimony";
import MemberAuthMiddleware from "../middleware/member-auth.middleware";

const router = express.Router();

// ============================================
// MEMBER SELF-SERVICE ROUTES (Member Auth)
// ============================================

/**
 * @route   POST /api/v1/testimony/submit
 * @desc    Submit testimony (Member)
 * @access  Protected (Member)
 */
router.post(
  "/submit",
  handleErrorAsync(MemberAuthMiddleware.verifyMemberToken),
  validateRequest(TestimonySchema.testimonyCreate),
  handleErrorAsync(TestimonyController.createMemberTestimony)
);

// ============================================
// PROTECTED ROUTES (Admin Only)
// ============================================

/**
 * @route   POST /api/v1/testimony
 * @desc    Create new testimony (Admin)
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
 * @route   GET /api/v1/testimony
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
 * @route   GET /api/v1/testimony/:id
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
 * @route   PUT /api/v1/testimony/:id
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