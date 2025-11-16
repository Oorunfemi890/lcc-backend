"use strict";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src", "data", "hero-slider.json");
const VALID_SLIDE_IDS = ["slide-1", "slide-2", "slide-3"];

class HeroSliderController {


  static async writeSliderData(data) {
    try {
      await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
    } catch (error) {
      throw new Error(`Failed to write slider data: ${error.message}`);
    }
  }


  /**
   * Helper: Read slider data from JSON file
   */
  static async readSliderData() {
    try {
      const data = await fs.readFile(DATA_FILE, "utf8");
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Failed to read slider data: ${error.message}`);
    }
  }

  /**
   * Helper: Delete old uploaded image
   */
  static async deleteOldImage(imagePath) {
    if (!imagePath || imagePath.startsWith("http")) {
      return; // Don't delete external URLs
    }

    try {
      const fullPath = path.join(__dirname, "..", imagePath);
      await fs.unlink(fullPath);
    } catch (error) {
      console.log("Could not delete old image:", error.message);
    }
  }

  /**
   * GET /api/hero-slider
   * Get all slides (public endpoint for frontend)
   */
  static async getSlides(req, res) {
    try {
      const sliderData = await HeroSliderController.readSliderData();

      return res.status(200).json({
        success: true,
        data: sliderData,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to load slider data",
        message: error.message,
      });
    }
  }

  /**
   * GET /api/hero-slider/admin/:id
   * Get single slide by ID
   */
  static async getSlideById(req, res) {
    try {
      const { id } = req.params;

      // Validate slide ID
      if (!VALID_SLIDE_IDS.includes(id)) {
        return res.status(400).json({
          success: false,
          error: "Invalid slide ID",
          message: `Slide ID must be one of: ${VALID_SLIDE_IDS.join(", ")}`,
        });
      }

      const sliderData = await HeroSliderController.readSliderData();
      const slide = sliderData.find((s) => s.id === id);
 
      if (!slide) {
        return res.status(404).json({
          success: false,
          error: "Slide not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: slide,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to fetch slide",
        message: error.message,
      });
    }
  }

  /**
   * PUT /api/hero-slider/admin/:id
   * Update slide (text + optional image upload)
   */
  static async updateSlide(req, res) {
    try {
      const ctaIcon = {
        "slide-1":"🎧",
         "slide-2":"📅",
         "slide-3": "❤️"
      }
      const { id } = req.params;
      const { title, subtitle, cta } = req.body;

      // Validate slide ID
      if (!VALID_SLIDE_IDS.includes(id)) {
        return res.status(400).json({
          success: false,
          error: "Invalid slide ID",
          message: `Slide ID must be one of: ${VALID_SLIDE_IDS.join(", ")}`,
        });
      }

      // Read current data
      const sliderData = await HeroSliderController.readSliderData();
      const slideIndex = sliderData.findIndex((s) => s.id === id);

      if (slideIndex === -1) {
        return res.status(404).json({
          success: false,
          error: "Slide not found",
        });
      }

      // Prepare updates
      const updates = {};
      if (title !== undefined) updates.title = title;
      if (subtitle !== undefined) updates.subtitle = subtitle;
      if (cta !== undefined) updates.cta = cta;
      updates.ctaIcon = ctaIcon[id];

      // Handle image upload (if provided via ImageUploadMiddleware)
      if (req.fileUrl) {
        // Delete old image if it was uploaded (not external URL)
        const oldImage = sliderData[slideIndex].image;
        await HeroSliderController.deleteOldImage(oldImage);

        updates.image = req.fileUrl;
      }

      // Update slide
      sliderData[slideIndex] = {
        ...sliderData[slideIndex],
        ...updates,
      };

      sliderData.lastUpdated = new Date().toISOString();

      // Write to file
      await HeroSliderController.writeSliderData(sliderData);

      return res.status(200).json({
        success: true,
        message: "Slide updated successfully",
        data: sliderData[slideIndex],
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to update slide",
        message: error.message,
      });
    }
  }
}

export default HeroSliderController;