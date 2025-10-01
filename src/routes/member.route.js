import express from "express";
import MemberController from "../controller/member.controller";
import { handleErrorAsync } from "../middleware/error-handler.middleware";
import AuthMiddleware from "../middleware/auth.middleware";
import  validateRequest  from "../middleware/validate-request.middleware";
import MemberSchema from "../schema/member";

const router = express.Router();

// ============================================
// PROTECTED ROUTES (Admin Only)
// ============================================

/**
 * @route   POST /api/member
 * @desc    Create new member
 * @access  Protected (Admin)
 */
router.post(
  "/",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(MemberSchema.memberCreate),
  handleErrorAsync(MemberController.createMember)
);

/**
 * @route   GET /api/member
 * @desc    Get all members with pagination and filters
 * @access  Protected (Admin)
 * @query   page, limit, search, active, membershipType
 */
router.get(
  "/",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(MemberSchema.memberGetAll),
  handleErrorAsync(MemberController.getAllMembers)
);

/**
 * @route   GET /api/member/:id
 * @desc    Get single member by ID
 * @access  Protected (Admin)
 */
router.get(
  "/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(MemberSchema.memberById),
  handleErrorAsync(MemberController.getOneMember)
);

/**
 * @route   PUT /api/member/:id
 * @desc    Update member details
 * @access  Protected (Admin)
 */
router.put(
  "/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(MemberSchema.memberUpdate),
  handleErrorAsync(MemberController.updateMember)
);


/**
 * @route   PATCH /api/member/:id/block
 * @desc    Block member
 * @access  Protected (Admin)
 */
router.patch(
  "/:id/block",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(MemberSchema.memberBlock),
  handleErrorAsync(MemberController.blockMember)
);



export default router;