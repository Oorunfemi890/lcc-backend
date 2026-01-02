import Joi from "joi";

const SettingsSchema = {
    // Create new setting
    createSetting: Joi.object({
        body: Joi.object({
            key: Joi.string().required().messages({
                'any.required': 'Key is required'
            }),
            value: Joi.string().required().messages({
                'any.required': 'Value is required'
            }),
            description: Joi.string().optional().allow(''),
            active: Joi.boolean().optional().default(true)
        })
    }),

    // Patch/Update setting
    patchSetting: Joi.object({
        params: Joi.object({
            key: Joi.string().required().messages({
                'any.required': 'Key is required in path'
            })
        }),
        body: Joi.object({
            value: Joi.string().optional(),
            active: Joi.boolean().optional(),
            description: Joi.string().optional().allow(''), // Allow updating description too if needed, though controller mainly does value/active
        }).min(1).messages({
            'object.min': 'At least one field (value or active) must be provided for update'
        })
    })
};

export default SettingsSchema;
