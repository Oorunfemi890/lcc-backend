import Joi from "joi";

export const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().required().min(3),
    newPassword: Joi.string().min(3).required().label('New Password'),
    confirmNewPassword: Joi.any().equal(Joi.ref('newPassword'))
        .required()
        .label('Confirm password')
        .options({ messages: { 'any.only': '{{#label}} does not match' } })
});