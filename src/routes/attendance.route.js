import express from "express";
import AttendanceController from "../controller/attendance.controller";
import AuthMiddleWare from "../middleware/auth.middleware";
import validateRequest from "../middleware/validate-request.middleware";
import { handleErrorAsync } from "../middleware/error-handler.middleware";

const router = express.Router();

router.post(
    "/",
    handleErrorAsync(AuthMiddleWare.verifyToken),
    handleErrorAsync(AuthMiddleWare.isAdmin),
    // validateRequest(createAttendanceSchema), 
    handleErrorAsync(AttendanceController.createAttendance)
);

router.get(
    "/",
    handleErrorAsync(AuthMiddleWare.verifyToken),
    handleErrorAsync(AuthMiddleWare.isAdmin),
    handleErrorAsync(AttendanceController.getAllAttendance)
);

router.get(
    "/stats",
    handleErrorAsync(AuthMiddleWare.verifyToken),
    handleErrorAsync(AuthMiddleWare.isAdmin),
    handleErrorAsync(AttendanceController.getStats)
);

router.get(
    "/:id",
    handleErrorAsync(AuthMiddleWare.verifyToken),
    handleErrorAsync(AuthMiddleWare.isAdmin),
    handleErrorAsync(AttendanceController.getOneAttendance)
);

router.put(
    "/:id",
    handleErrorAsync(AuthMiddleWare.verifyToken),
    handleErrorAsync(AuthMiddleWare.isAdmin),
    handleErrorAsync(AttendanceController.updateAttendance)
);

router.delete(
    "/:id",
    handleErrorAsync(AuthMiddleWare.verifyToken),
    handleErrorAsync(AuthMiddleWare.isAdmin),
    handleErrorAsync(AttendanceController.deleteAttendance)
);

export default router;
