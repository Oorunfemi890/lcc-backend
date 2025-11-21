// src/schema/admin/index.js
const Joi = require('joi');

const AdminSchema = {
  // Get all admins with filters
  adminGetAll: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      role: Joi.string().valid("SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER").optional(),
      active: Joi.boolean().optional(),
      search: Joi.string().optional(),
    })
  },

  // Create admin
  createAdmin: {
    body: Joi.object({
      memberId: Joi.string().uuid().required(),
      role: Joi.string().valid("SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER").default("ADMIN"),
      password: Joi.string().min(6).optional(),
    })
  },

  // Find admin by ID
  findAminById: {
    params: Joi.object({
      id: Joi.string().uuid().required(),
    })
  },

  // Update admin
  updateAdmin: {
    params: Joi.object({
      id: Joi.string().uuid().required(),
    }),
    body: Joi.object({
      role: Joi.string().valid("SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER").optional(),
      active: Joi.boolean().optional(),
    })
  },

  // Delete admin
  deleteAdmin: {
    params: Joi.object({
      id: Joi.string().uuid().required(),
    })
  },

  // Update admin password
  updateAdminPassword: {
    params: Joi.object({
      id: Joi.string().uuid().required(),
    }),
    body: Joi.object({
      password: Joi.string().min(6).required(),
    })
  }
};

module.exports = AdminSchema;