import db from "../../models";
import { Op } from "sequelize";

const Celebrant = db.Celebrant;
import { logger } from "../logger/winston";

class CelebrantController {
  /**
   * Create Celebrant
   */
  static async createCelebrant(req, res) {
    try {
      const {
        memberId,
        name,
        celebrationType,
        celebrationDate,
        contact,
        message,
      } = req.body;
      const photoUrl = req.fileUrl

      if (!name || !celebrationType || !celebrationDate || !contact) {
        return res.status(400).send({
          message:
            "Missing required fields: {name} {celebrationType} {celebrationDate} {contact}",
        });
      }

      const celebrant = await Celebrant.create({
        name,
        celebrationType,
        celebrationDate,
        contact,
        message,
        specialRequests: message,
        photoUrl,
      });

      return res
        .status(201)
        .send({ message: "Celebrant created successfully" });
    } catch (error) {
      logger.error("Error creating celebrant: ", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * Update Celebrant
   */
  static async updateCelebrant(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const celebrant = await Celebrant.findOne({ where: { id } });
      if (!celebrant) {
        return res.status(404).send({ message: "Celebrant not found" });
      }

      await Celebrant.update(updates, { where: { id } });

      const updatedCelebrant = await Celebrant.findOne({ where: { id } });

      return res.status(200).send({
        message: "Celebrant updated successfully",
        celebrant: updatedCelebrant,
      });
    } catch (error) {
      logger.error("Error updating celebrant: ", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * Delete Celebrant
   */
  static async deleteCelebrant(req, res) {
    try {
      const { id } = req.params;

      const celebrant = await Celebrant.findOne({ where: { id } });
      if (!celebrant) {
        return res.status(404).send({ message: "Celebrant not found" });
      }

      await Celebrant.destroy({ where: { id } });

      return res
        .status(200)
        .send({ message: "Celebrant deleted successfully" });
    } catch (error) {
      logger.error("Error deleting celebrant: ", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * Get Celebrant Statistics
   */
  static async getStats(req, res) {
    try {
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Normalize to start of day

      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);

      // Total celebrants
      const totalCelebrants = await Celebrant.count();

      // Upcoming celebrants (celebration date is in the future)
      const upcomingCelebrants = await Celebrant.count({
        where: {
          celebrationDate: {
            [Op.gte]: now
          }
        }
      });

      // This month's celebrants
      const thisMonthCelebrants = await Celebrant.count({
        where: {
          celebrationDate: {
            [Op.gte]: now,
            [Op.lte]: endOfMonth
          }
        }
      });

      // Count by type
      const birthdayCount = await Celebrant.count({
        where: { celebrationType: 'birthday' }
      });

      const anniversaryCount = await Celebrant.count({
        where: { celebrationType: 'anniversary' }
      });

      return res.status(200).json({
        success: true,
        data: {
          totalCelebrants,
          upcomingCelebrants,
          thisMonthCelebrants,
          birthdayCount,
          anniversaryCount
        },
        message: "Celebrant statistics retrieved successfully"
      });
    } catch (error) {
      logger.error("Error fetching celebrant stats:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch celebrant statistics",
        error: error.message
      });
    }
  }

  /**
   * Find All Celebrants (Paginated + Filters)
   */
  static async findAllCelebrants(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        name,
        celebrationType,
        isPublic,
        active,
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);
      const where = {};

      if (name) {
        where.name = { [Op.iLike]: `%${name}%` }; // case-insensitive search
      }
      if (celebrationType) {
        where.celebrationType = celebrationType;
      }
      if (isPublic !== undefined) {
        where.isPublic = isPublic === "true";
      }
      if (active !== undefined) {
        where.active = active === "true";
      }

      const { rows, count } = await Celebrant.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset,
        order: [["celebrationDate", "ASC"]],
      });

      return res.status(200).send({
        message: "Celebrants fetched successfully",
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        celebrants: rows,
      });
    } catch (error) {
      logger.error("Error fetching celebrants: ", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }
}

export default CelebrantController;
