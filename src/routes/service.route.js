import express from "express";
import ServiceController from "../controller/service.controller";
import YoutubeController from "../controller/youtube.controller";
import { handleErrorAsync } from "../middleware/error-handler.middleware";
import AuthMiddleware from "../middleware/auth.middleware";
import validateRequest from "../middleware/validate-request.middleware";
import ServiceSchema from "../schema/service";

const router = express.Router();

/**
 * @route   GET /api/v1/youtube/channel
 * @desc    Get channel info
 * @access  Public
 */
router.get(
  "/channel",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  handleErrorAsync(YoutubeController.getChachammelnnelInfo)
);


/**
 * @route   GET /api/v1/youtube/latest
 * @desc    Get latest videos from YouTube channel
 * @access  Public
 * @query   limit
 */
router.get(
  "/online",
  handleErrorAsync(YoutubeController.getLatestVideos)
);


// ============================================
// PROTECTED ROUTES (Admin Only)
// ============================================

/**
 * @route   GET /api/service/group-by-day
 * @desc    Get services grouped by day of week
  * @access  Protected(Admin)
    * @query   active, serviceType
      */
router.get(
  "/group-by-day",
  handleErrorAsync(ServiceController.getServicesByDayOfWeek)
);

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

/**
 * @route   DELETE /api/service/:id
 * @desc    Delete service
 * @access  Protected (Admin)
 */
router.delete(
  "/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(ServiceSchema.serviceById),
  handleErrorAsync(ServiceController.deleteService)
);

export default router;