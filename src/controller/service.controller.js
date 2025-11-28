// controllers/serviceController.js
"use strict";
const { Service } = require("../../models");

const { Op } = require("sequelize");

class ServiceController {
  // Create Service
  static async createService(req, res) {
    try {
      const service = await Service.create(req.body);
      return res.status(201).json(service);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Get All Services (with queries + pagination)
  static async findAllService(req, res) {
    try {
      const { page = 1, limit = 10, serviceType, frequency, dayOfWeek, active, title } = req.query;

      const where = {};
      if (serviceType) where.serviceType = serviceType;
      if (frequency) where.frequency = frequency;
      if (dayOfWeek) where.dayOfWeek = dayOfWeek;
      if (active !== undefined) where.active = active === "true";
      if (title) where.title = { [Op.iLike]: `%${title}%` };

      const offset = (page - 1) * limit;

      const { count, rows } = await Service.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["serviceDate", "DESC"], ["startTime", "DESC"]],
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

  // Get Single Service by ID
  static async findOneService(req, res) {
    try {
      const service = await Service.findByPk(req.params.id);
      if (!service) return res.status(404).json({ error: "Service not found" });
      return res.json(service);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Update Service
  static async updateService(req, res) {
    try {
      const service = await Service.findByPk(req.params.id);
      if (!service) return res.status(404).json({ error: "Service not found" });

      await service.update(req.body);
      return res.json(service);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Delete Service
  static async deleteService(req, res) {
    try {
      const service = await Service.findByPk(req.params.id);
      if (!service) return res.status(404).json({ error: "Service not found" });

      await service.destroy();
      return res.json({ message: "Service deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Group Services by Day of Week
  static async getServicesByDayOfWeek(req, res) {
    try {
      const { active, serviceType } = req.query;

      const where = {};
      if (active !== undefined) where.active = active === "true";
      if (serviceType) where.serviceType = serviceType;

      // Get all services grouped by dayOfWeek
      const services = await Service.findAll({
        where,
        order: [["dayOfWeek", "ASC"], ["startTime", "ASC"]],
      });

      // Define day order for proper sorting
      const dayOrder = ['sunday', 'tuesday', 'thursday'];

      // Group services by day of week
      const groupedByDay = services.reduce((acc, service) => {
        const day = service.dayOfWeek || 'unscheduled';
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(service);
        return acc;
      }, {});

      // Sort the result by day order
      const sortedResult = {};
      dayOrder.forEach(day => {
        if (groupedByDay[day]) {
          sortedResult[day] = groupedByDay[day];
        }
      });

      // Add unscheduled services at the end if any
      if (groupedByDay['unscheduled']) {
        sortedResult['unscheduled'] = groupedByDay['unscheduled'];
      }

      // Calculate counts
      const summary = Object.keys(sortedResult).map(day => ({
        day,
        count: sortedResult[day].length,
        services: sortedResult[day]
      }));

      return res.json({
        groupedByDay: sortedResult,
        summary,
        totalServices: services.length
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ServiceController;
