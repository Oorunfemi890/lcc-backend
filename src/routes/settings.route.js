import express from 'express';
import SettingsController from '../controller/settings.controller';
import AuthMiddleware from '../middleware/auth.middleware';
import { handleErrorAsync } from '../middleware/error-handler.middleware';

import validateRequest from '../middleware/validate-request.middleware';
import SettingsSchema from '../schema/settings/settings.schema';

const router = express.Router();

router.get(
    '/',
    handleErrorAsync(AuthMiddleware.verifyToken),
    handleErrorAsync(AuthMiddleware.isAdmin),
    SettingsController.getSettings
);

router.post(
    '/',
    handleErrorAsync(AuthMiddleware.verifyToken),
    handleErrorAsync(AuthMiddleware.isAdmin),
    validateRequest(SettingsSchema.createSetting),
    SettingsController.createSetting
);

router.patch(
    '/:key',
    handleErrorAsync(AuthMiddleware.verifyToken),
    handleErrorAsync(AuthMiddleware.isAdmin),
    validateRequest(SettingsSchema.patchSetting),
    SettingsController.patchSetting
);

export default router;
