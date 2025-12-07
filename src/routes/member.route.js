import express from "express";
import MemberController from "../controller/member.controller";
import { handleErrorAsync } from "../middleware/error-handler.middleware";
import AuthMiddleware from "../middleware/auth.middleware";
import validateRequest from "../middleware/validate-request.middleware";
import MemberSchema from "../schema/member";
import ImageUploadMiddleware from '../middleware/image-upload.middleware';
import MemberAuthMiddleware from '../middleware/member-auth.middleware';

const router = express.Router();

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * @route   POST /api/v1/member/lookup
 * @desc    Lookup member by hash (Phone + DOB + PIN)
 * @access  Public
 */
router.post(
  "/lookup",
  validateRequest(MemberSchema.memberLookup),
  handleErrorAsync(MemberController.lookupMember)
);

// ============================================
// PROTECTED ROUTES (Admin Only)
// ============================================

/**
 * @route   POST /api/v1/member
 * @desc    Create new member
 * @access  Protected (Admin)
 */
router.post(
  "/",
  ImageUploadMiddleware,
  validateRequest(MemberSchema.memberCreate),
  handleErrorAsync(MemberController.createMember)
);

/**
 * @route   GET /api/v1/member
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
 * @route   GET /api/v1/member/departments
 * @desc    Get all departments (membershipType values)
 * @access  Protected (Admin)
 */
router.get(
  "/departments",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  handleErrorAsync(MemberController.getDepartments)
);

/**
 * @route   GET /api/v1/member/children
 * @desc    Get children of a member
 * @access  Public
 * @query   parentId
 */
router.get(
  "/children",
  handleErrorAsync(MemberAuthMiddleware.verifyMemberToken),
  validateRequest(MemberSchema.memberGetChildren),
  handleErrorAsync(MemberController.getMemberChildren)
);

/**
 * @route   GET /api/v1/member/:id
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
 * @route   PUT /api/v1/member/update-profile
 * @desc    Update member's own profile
 * @access  Protected (Member)
 */
router.put(
  "/update-profile",
  handleErrorAsync(MemberAuthMiddleware.verifyMemberToken),
  validateRequest(MemberSchema.updateProfile),
  handleErrorAsync(MemberController.updateMemberProfile)
);

/**
 * @route   PUT /api/v1/member/:id
 * @desc    Update member details (Admin)
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
 * @route   PATCH /api/v1/member/:id/block
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

// ============================================
// MEMBER SELF-SERVICE ROUTES (Member Auth)
// ============================================

/**
 * @route   POST /api/v1/member/add-child
 * @desc    Create new child member with parent relationship
 * @access  Protected (Member)
 */
router.post(
  "/add-child",
  handleErrorAsync(MemberAuthMiddleware.verifyMemberToken),
  ImageUploadMiddleware,
  validateRequest(MemberSchema.memberCreateChild),
  handleErrorAsync(MemberController.createChildMember)
);



export default router;