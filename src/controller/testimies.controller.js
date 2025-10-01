"use strict";
const { Testimony, Member } = require("../../models");
const { Op } = require("sequelize");

class TestimonyController {
  // Create a testimony
  static async createTestimony(req, res) {
    try {
      const testimony = await Testimony.create(req.body);
      return res.status(201).json(testimony);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Get all testimonies (with filters + pagination)
  static async findAllTestimonies(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        category, 
        isPublic, 
        sharedInService, 
        active, 
        memberId, 
        content 
      } = req.query;

      const where = {};
      if (category) where.category = category;
      if (isPublic !== undefined) where.isPublic = isPublic === "true";
      if (sharedInService !== undefined) where.sharedInService = sharedInService === "true";
      if (active !== undefined) where.active = active === "true";
      if (memberId) where.memberId = memberId;
      if (content) where.content = { [Op.iLike]: `%${content}%` };

      const offset = (page - 1) * limit;

      const { count, rows } = await Testimony.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Member,
            as: "member",
            attributes: ["id", "firstName", "lastName", "email", "phone"]
          }
        ]
      });

      return res.json({
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        data: rows
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Get a single testimony
  static async findOneTestimony(req, res) {
    try {
      const testimony = await Testimony.findByPk(req.params.id, {
        include: [
          {
            model: Member,
            as: "member",
            attributes: ["id", "firstName", "lastName", "email", "phone"]
          }
        ]
      });
      if (!testimony) return res.status(404).json({ error: "Testimony not found" });
      return res.json(testimony);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Update a testimony
  static async updateTestimony(req, res) {
    try {
      const testimony = await Testimony.findByPk(req.params.id);
      if (!testimony) return res.status(404).json({ error: "Testimony not found" });

      await testimony.update(req.body);
      return res.json(testimony);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Delete a testimony
  static async deleteTestimony(req, res) {
    try {
      const testimony = await Testimony.findByPk(req.params.id);
      if (!testimony) return res.status(404).json({ error: "Testimony not found" });

      await testimony.destroy();
      return res.json({ message: "Testimony deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = TestimonyController;
