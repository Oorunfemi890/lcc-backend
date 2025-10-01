import express from "express";
import ServiceController from "../controller/service.controller";
import { handleErrorAsync } from "../middleware/error-handler.middleware";
import AuthMiddleware from "../middleware/auth.middleware";
import  validateRequest  from "../middleware/validate-request.middleware";
import ServiceSchema from "../schema/service";

const router = express.Router();

// ============================================
// PROTECTED ROUTES (Admin Only)
// ============================================

/**
 * @route   POST /api/service
 * @desc    Create new service
 * @access  Protected (Admin)
 */
router.post(
  "/",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(ServiceSchema.serviceCreate),
  handleErrorAsync(ServiceController.createService)
);

/**
 * @route   GET /api/service
 * @desc    Get all services with pagination and filters
 * @access  Protected (Admin)
 * @query   page, limit, serviceType, frequency, dayOfWeek, active, title
 */
router.get(
  "/",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(ServiceSchema.serviceGetAll),
  handleErrorAsync(ServiceController.findAllService)
);

/**
 * @route   GET /api/service/:id
 * @desc    Get single service by ID
 * @access  Protected (Admin)
 */
router.get(
  "/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(ServiceSchema.serviceById),
  handleErrorAsync(ServiceController.findOneService)
);

/**
 * @route   PUT /api/service/:id
 * @desc    Update service details
 * @access  Protected (Admin)
 */
router.put(
  "/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(ServiceSchema.serviceUpdate),
  handleErrorAsync(ServiceController.updateService)
);


export default router;