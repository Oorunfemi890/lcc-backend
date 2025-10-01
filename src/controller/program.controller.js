// controllers/programController.js
"use strict";
const { Program } = require("../../models");

class ProgramController {
  // Create Program
  static async createProgram(req, res) {
    try {
      const program = await Program.create(req.body);
      return res.status(201).json(program);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Get All Programs (with queries + pagination)
  static async findAllProgram(req, res) {
    try {
      const { page = 1, limit = 10, category, frequency, name } = req.query;

      const where = {};
      if (category) where.category = category;
      if (frequency) where.frequency = frequency;
      if (name) where.name = { [require("sequelize").Op.iLike]: `%${name}%` };

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
