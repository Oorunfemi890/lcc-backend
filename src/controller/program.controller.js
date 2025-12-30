// controllers/programController.js
"use strict";
import db from "../../models";
const { Program } = db

class ProgramController {
  // Create Program
  static async createProgram(req, res) {
    try {
      const program = await Program.create({ imageUrl: req.fileUrl, ...req.body });
      return res.status(201).json(program);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Get All Programs (with queries + pagination)
  static async findAllProgram(req, res) {
    try {
      const { page = 1, limit = 10, category, frequency, name, status } = req.query;
      const { Op } = require("sequelize");

      const where = {};
      if (category) where.category = category;
      if (frequency) where.frequency = frequency;
      if (name) where.name = { [Op.iLike]: `%${name}%` };

      // Filter by status using date comparisons
      if (status) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (status === 'upcoming') {
          // Events that haven't started yet
          where.startDate = { [Op.gt]: today };
        } else if (status === 'ongoing') {
          // Events that have started but not ended
          where[Op.and] = [
            { startDate: { [Op.lte]: today } },
            {
              [Op.or]: [
                { endDate: { [Op.gte]: today } },
                { endDate: null }
              ]
            }
          ];
        } else if (status === 'completed') {
          // Events that have ended
          where.endDate = { [Op.lt]: today };
        }
        // Note: 'cancelled' status would require a separate cancelled field in the database
      }

      const offset = (page - 1) * limit;

      const { count, rows } = await Program.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["createdAt", "DESC"]],
      });

      return res.json({
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        data: rows,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Get Program Statistics
  static async getStats(req, res) {
    try {
      const { Op } = require("sequelize");

      // Get current date at start of day (midnight) for proper date comparison
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      // Total events
      const totalEvents = await Program.count();

      // Upcoming events (startDate >= today)
      const upcomingEvents = await Program.count({
        where: {
          startDate: {
            [Op.gte]: now
          }
        }
      });

      // Completed events (endDate < today OR startDate < today if no endDate)
      const completedEvents = await Program.count({
        where: {
          [Op.or]: [
            {
              endDate: {
                [Op.lt]: now
              }
            },
            {
              [Op.and]: [
                { endDate: null },
                {
                  startDate: {
                    [Op.lt]: now
                  }
                }
              ]
            }
          ]
        }
      });

      // Events created this month
      const thisMonthEvents = await Program.count({
        where: {
          createdAt: {
            [Op.gte]: startOfMonth,
            [Op.lte]: endOfMonth
          }
        }
      });

      return res.status(200).json({
        success: true,
        data: {
          totalEvents,
          upcomingEvents,
          completedEvents,
          thisMonthEvents
        },
        message: "Program stats retrieved successfully"
      });
    } catch (error) {
      console.error("Program stats error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch program stats",
        error: error.message
      });
    }
  }

  // Get Single Program by ID
  static async findOneProgram(req, res) {
    try {
      const program = await Program.findByPk(req.params.id);
      if (!program) return res.status(404).json({ error: "Program not found" });
      return res.json(program);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Update Program
  static async updateProgram(req, res) {
    try {
      const program = await Program.findByPk(req.params.id);
      if (!program) return res.status(404).json({ error: "Program not found" });

      await program.update(req.body);
      return res.json(program);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Delete Program
  static async deleteProgram(req, res) {
    try {
      const program = await Program.findByPk(req.params.id);
      if (!program) return res.status(404).json({ error: "Program not found" });

      await program.destroy();
      return res.json({ message: "Program deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ProgramController;
