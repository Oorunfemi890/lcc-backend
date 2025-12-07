import express from "express";
import DashboardController from "../controller/dashboard.controller";
import AuthMiddleware from "../middleware/auth.middleware";
import { handleErrorAsync } from "../middleware/error-handler.middleware";

const router = express.Router();

// ============================================
// PROTECTED ROUTES (Admin Only)
// ============================================

router.get(
    "/stats",
    handleErrorAsync(AuthMiddleware.verifyToken),
    handleErrorAsync(AuthMiddleware.isAdmin),
    handleErrorAsync(DashboardController.getStats)
);

router.get(
    "/quick-stats",
    handleErrorAsync(AuthMiddleware.verifyToken),
    handleErrorAsync(AuthMiddleware.isAdmin),
    handleErrorAsync(DashboardController.getQuickStats)
);

router.get(
    "/recent-activities",
    handleErrorAsync(AuthMiddleware.verifyToken),
    handleErrorAsync(AuthMiddleware.isAdmin),
    handleErrorAsync(DashboardController.getRecentActivities)
);

router.get(
    "/upcoming-events",
    handleErrorAsync(AuthMiddleware.verifyToken),
    handleErrorAsync(AuthMiddleware.isAdmin),
    handleErrorAsync(DashboardController.getUpcomingEvents)
);

router.get(
    "/chart-data",
    handleErrorAsync(AuthMiddleware.verifyToken),
    handleErrorAsync(AuthMiddleware.isAdmin),
    handleErrorAsync(DashboardController.getChartData)
);

router.get(
    "/member-growth",
    handleErrorAsync(AuthMiddleware.verifyToken),
    handleErrorAsync(AuthMiddleware.isAdmin),
    handleErrorAsync(DashboardController.getChartData)
);

export default router;
