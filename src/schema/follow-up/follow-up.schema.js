// followUpSchemas.js
const Joi = require("joi");

const followUpSchemas = {
  // ✅ Create Follow-up
  createFollowUp: Joi.object({
    firstTimerId: Joi.string().uuid().required(),
    assignedToMemberId: Joi.string().uuid().optional(),
    followUpType: Joi.string()
      .valid("call", "visit", "meeting", "prayer", "counseling", "other")
      .required(),
    scheduledDate: Joi.date().iso().required(),
    notes: Joi.string().max(2000).optional(),
    nextFollowUpDate: Joi.date().iso().optional(),
  }),

  // ✅ Get All Follow-ups (filters + pagination)
  getAllFollowUps: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status: Joi.string()
      .valid("pending", "completed", "cancelled")
      .optional(),
    followUpType: Joi.string()
      .valid("call", "visit", "meeting", "prayer", "counseling", "other")
      .optional(),
    assignedToMemberId: Joi.string().uuid().optional(),
    firstTimerId: Joi.string().uuid().optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
  }),

  // ✅ Get Single Follow-up
  getFollowUpById: Joi.object({
    id: Joi.string().uuid().required(),
  }),

  // ✅ Update Follow-up
  updateFollowUp: Joi.object({
    followUpType: Joi.string()
      .valid("call", "visit", "meeting", "prayer", "counseling", "other")
      .optional(),
    scheduledDate: Joi.date().iso().optional(),
    notes: Joi.string().max(2000).optional(),
    status: Joi.string()
      .valid("pending", "completed", "cancelled")
      .optional(),
    nextFollowUpDate: Joi.date().iso().optional(),
    assignedToMemberId: Joi.string().uuid().optional(),
  }),

  // ✅ Delete Follow-up
  deleteFollowUp: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};

module.exports = followUpSchemas;
