import express from "express";
import HeroSliderController from "../controller/hero-slider.controller";
import { handleErrorAsync } from "../middleware/error-handler.middleware";
import AuthMiddleware from "../middleware/auth.middleware";
import validateRequest from "../middleware/validate-request.middleware";
import HeroSliderSchema from "../schema/hero-slide";
import ImageUploadMiddleware from '../middleware/image-upload.middleware';

const router = express.Router();

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * @route   GET /api/hero-slider
 * @desc    Get all hero slider data (for frontend)
 * @access  Public
 */
router.get(
  "/",
  handleErrorAsync(HeroSliderController.getSlides)
);

// ============================================
// PROTECTED ROUTES (Admin Only)
// ============================================



/**
 * @route   GET /api/hero-slider/admin/:id
 * @desc    Get single slide by ID
 * @access  Protected (Admin)
 */
router.get(
  "/admin/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  validateRequest(HeroSliderSchema.getSlideById),
  handleErrorAsync(HeroSliderController.getSlideById)
);

/**
 * @route   PUT /api/hero-slider/admin/:id
 * @desc    Update slide (text + optional image)
 * @access  Protected (Admin)
 * @note    Only slide-1, slide-2, slide-3 allowed
 * @note    Cannot create or delete slides (fixed 3 slides)
 */
router.put(
  "/admin/:id",
  handleErrorAsync(AuthMiddleware.verifyToken),
  handleErrorAsync(AuthMiddleware.isAdmin),
  ImageUploadMiddleware,
  validateRequest(HeroSliderSchema.updateSlide),
  handleErrorAsync(HeroSliderController.updateSlide)
);

export default router;