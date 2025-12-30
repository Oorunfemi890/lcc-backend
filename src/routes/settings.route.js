import express from 'express';
import SettingsController from '../controller/settings.controller';
import AuthMiddleware from '../middleware/auth.middleware';
import { handleErrorAsync } from '../middleware/error-handler.middleware';

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
    SettingsController.createSetting
);

router.patch(
    '/:key',
    handleErrorAsync(AuthMiddleware.verifyToken),
    handleErrorAsync(AuthMiddleware.isAdmin),
    SettingsController.patchSetting
);

export default router;
