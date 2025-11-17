const Joi = require('joi');

const createFirstTimer = {
  body: Joi.object({
    visitDate: Joi.date().iso().optional(),

    // Reception Card Fields
    surname: Joi.string().min(1).max(100).required(),
    otherNames: Joi.string().min(1).max(100).required(),
    residenceAddress: Joi.string().allow(null, '').optional(),
    nearestBusStop: Joi.string().allow(null, '').optional(),
    officeAddress: Joi.string().allow(null, '').optional(),

    phoneNumber: Joi.string().pattern(/^[0-9]{7,15}$/).required(),
    whatsappNumber: Joi.string().pattern(/^[0-9]{7,15}$/).optional(),

    email: Joi.string().email().allow(null, '').optional(),

    // Questions from Reception Card
    interestedInJoining: Joi.boolean().optional(),
    whereBestToMeet: Joi.string().allow(null, '').optional(),
    welcomeToFellowship: Joi.boolean().optional(),

    // Demographics
    maritalStatus: Joi.string()
      .valid('single', 'married', 'divorced_separated', 'widowed')
      .allow(null)
      .optional(),

    ageGroup: Joi.string()
      .valid('10-20', '21-30', '31-40', '41-50', '51-above')
      .allow(null)
      .optional(),

    // Prayer Request
    prayerRequest: Joi.string().allow(null, '').optional(),

    // Feedback Questions
    enjoyedMost: Joi.string().allow(null, '').optional(),
    whatStoodOut: Joi.string().allow(null, '').optional(),
    improvementSuggestions: Joi.string().allow(null, '').optional(),
    futureTopicSuggestions: Joi.string().allow(null, '').optional(),
    hospitalityFeedback: Joi.string().allow(null, '').optional(),

    overallExperienceRating: Joi.number().integer().min(1).max(5).optional(),
    likelihoodToReturn: Joi.number().integer().min(1).max(5).optional(),

    wantMoreOf: Joi.string()
      .valid('worship', 'teaching', 'prayer', 'fellowship')
      .allow(null)
      .optional()
  }),
};

module.exports = createFirstTimer;
