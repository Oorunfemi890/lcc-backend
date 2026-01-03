import Joi from "joi";

const AdminManagementSchema = {
    // List admins with filtering
    listAdmins: Joi.object({
        query: Joi.object({
            page: Joi.number().integer().min(1).optional(),
            limit: Joi.number().integer().min(1).max(100).optional(),
            role: Joi.string().valid('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER').optional(),
            active: Joi.string().valid('true', 'false').optional(),
            search: Joi.string().optional()
        })
    }),

    // Create admin
    createAdmin: Joi.object({
        body: Joi.object({
            email: Joi.string().email().required().messages({
                'string.email': 'Please provide a valid email address',
                'any.required': 'Email is required'
            }),
            memberId: Joi.string().uuid().required().messages({
                'string.guid': 'Member ID must be a valid UUID',
                'any.required': 'Member ID is required'
            }),
            role: Joi.string().valid('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER').required().messages({
                'any.only': 'Role must be one of: SUPER_ADMIN, ADMIN, EDITOR, VIEWER',
                'any.required': 'Role is required'
            }),
            password: Joi.string().min(8).required().messages({
                'string.min': 'Password must be at least 8 characters long',
                'any.required': 'Password is required'
            })
        })
    }),

    // Update admin
    updateAdmin: Joi.object({
        params: Joi.object({
            id: Joi.string().uuid().required().messages({
                'string.guid': 'Admin ID must be a valid UUID'
            })
        }),
        body: Joi.object({
            email: Joi.string().email().optional().messages({
                'string.email': 'Please provide a valid email address'
            }),
            role: Joi.string().valid('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER').optional().messages({
                'any.only': 'Role must be one of: SUPER_ADMIN, ADMIN, EDITOR, VIEWER'
            }),
            active: Joi.boolean().optional()
        }).min(1).messages({
            'object.min': 'At least one field must be provided for update'
        })
    }),

    // Block/unblock admin
    blockAdmin: Joi.object({
        params: Joi.object({
            id: Joi.string().uuid().required().messages({
                'string.guid': 'Admin ID must be a valid UUID'
            })
        }),
        body: Joi.object({
            blocked: Joi.boolean().required().messages({
                'any.required': 'Blocked status is required'
            })
        })
    }),

    // Reset password
    resetPassword: Joi.object({
        params: Joi.object({
            id: Joi.string().uuid().required().messages({
                'string.guid': 'Admin ID must be a valid UUID'
            })
        })
    }),

    // Delete admin
    deleteAdmin: Joi.object({
        params: Joi.object({
            id: Joi.string().uuid().required().messages({
                'string.guid': 'Admin ID must be a valid UUID'
            })
        })
    })
};

export default AdminManagementSchema;
