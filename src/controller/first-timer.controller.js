import db from "../../models";
const { FirstTimer, FollowUp } = db;
import { Op } from "sequelize";

class FirstTimerController {
  /**
   * Create First Timer
   */
  static async createFirstTimer(req, res) {
    try {
      const data = req.body;

      const firstTimer = await FirstTimer.create(data);

      return res.status(201).send({
        message: "First timer created successfully",
        data: firstTimer,
      });
    } catch (error) {
      console.error("Error creating first timer:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * Get All First Timers (with query filters + pagination)
   */
  static async getAllFirstTimers(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        maritalStatus,
        ageGroup,
        visitDate,
        startDate,
        endDate,
        interestedInJoining,
      } = req.query;

      const where = {};

      if (maritalStatus) where.maritalStatus = maritalStatus;
      if (ageGroup) where.ageGroup = ageGroup;
      if (visitDate) where.visitDate = visitDate;
      if (interestedInJoining) where.interestedInJoining = interestedInJoining === "true";

      // Date range filtering
      if (startDate && endDate) {
        where.visitDate = { [Op.between]: [startDate, endDate] };
      } else if (startDate) {
        where.visitDate = { [Op.gte]: startDate };
      } else if (endDate) {
        where.visitDate = { [Op.lte]: endDate };
      }

      const offset = (page - 1) * limit;

      const { count, rows } = await FirstTimer.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: FollowUp,
            as: "followUps",
            attributes: ["id", "followUpType", "status", "scheduledDate"],
          },
        ],
      });

      return res.status(200).send({
        message: "First timers retrieved successfully",
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
        data: rows,
      });
    } catch (error) {
      console.error("Error fetching first timers:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * Get Single First Timer
   */
  static async getFirstTimer(req, res) {
    try {
      const { id } = req.params;

      const firstTimer = await FirstTimer.findByPk(id, {
        include: [
          {
            model: FollowUp,
            as: "followUps",
            attributes: ["id", "followUpType", "status", "scheduledDate"],
          },
        ],
      });

      if (!firstTimer) {
        return res.status(404).send({ message: "First timer not found" });
      }

      return res.status(200).send({
        message: "First timer retrieved successfully",
        data: firstTimer,
      });
    } catch (error) {
      console.error("Error fetching first timer:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * Update First Timer
   */
  static async updateFirstTimer(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      const firstTimer = await FirstTimer.findByPk(id);
      if (!firstTimer) {
        return res.status(404).send({ message: "First timer not found" });
      }

      await firstTimer.update(data);

      return res.status(200).send({
        message: "First timer updated successfully",
        data: firstTimer,
      });
    } catch (error) {
      console.error("Error updating first timer:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * Delete First Timer
   */
  static async deleteFirstTimer(req, res) {
    try {
      const { id } = req.params;

      const firstTimer = await FirstTimer.findByPk(id);
      if (!firstTimer) {
        return res.status(404).send({ message: "First timer not found" });
      }

      await firstTimer.destroy();

      return res.status(200).send({ message: "First timer deleted successfully" });
    } catch (error) {
      console.error("Error deleting first timer:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }
}

export default FirstTimerController;
