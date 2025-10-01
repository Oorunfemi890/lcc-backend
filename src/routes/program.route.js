import express from "express";
import ProgramController from "../controller/program.controller";
import { handleErrorAsync } from "../middleware/error-handler.middleware";
import AuthMiddleware from "../middleware/auth.middleware";
import  validateRequest  from "../middleware/validate-request.middleware";
import ProgramSchema from "../schema/program";

const router = express.Router();

// ============================================
// PROTECTED ROUTES (Admin Only)
// ============================================

/**
 * @route   POST /api/program
 * @desc    Create new program
 * @access  Protected (Admin)
 */
router.post(
  "/",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(ProgramSchema.programCreate),
  handleErrorAsync(ProgramController.createProgram)
);

/**
 * @route   GET /api/program
 * @desc    Get all programs with pagination and filters
 * @access  Protected (Admin)
 * @query   page, limit, category, frequency, name
 */
router.get(
  "/",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(ProgramSchema.programGetAll),
  handleErrorAsync(ProgramController.findAllProgram)
);

/**
 * @route   GET /api/program/:id
 * @desc    Get single program by ID
 * @access  Protected (Admin)
 */
router.get(
  "/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(ProgramSchema.programById),
  handleErrorAsync(ProgramController.findOneProgram)
);

/**
 * @route   PUT /api/program/:id
 * @desc    Update program details
 * @access  Protected (Admin)
 */
router.put(
  "/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(ProgramSchema.updateProgram),
  handleErrorAsync(ProgramController.updateProgram)
);

/**
 * @route   DELETE /api/program/:id
 * @desc    Delete program
 * @access  Protected (Admin)
 */
router.delete(
  "/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isSuperAdmin),
  validateRequest(ProgramSchema.deleteProgram),
  handleErrorAsync(ProgramController.deleteProgram)
);

export default router;