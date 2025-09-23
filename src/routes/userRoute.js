import express from "express";
import UserController from "../controller/UserController";
import AuthMiddleWare from "../middleware/AuthMiddleware";
import { handleErrorAsync } from "../middleware/ErrorHandler";

const router = express.Router();

router.get(
  "/admin/users/get-all",
  handleErrorAsync(AuthMiddleWare.verifyToken),
  handleErrorAsync(AuthMiddleWare.isAdmin),
  handleErrorAsync(UserController.getAllUsers)
);

router.patch(
  "/admin/user/block/:id",
  handleErrorAsync(AuthMiddleWare.verifyToken),
  handleErrorAsync(AuthMiddleWare.isAdmin),
  handleErrorAsync(UserController.blockUser)
);

router.patch(
  "/admin/user/unblock/:id",
  handleErrorAsync(AuthMiddleWare.verifyToken),
  handleErrorAsync(AuthMiddleWare.isAdmin),
  handleErrorAsync(UserController.unBlockUser)
);

export default router;
