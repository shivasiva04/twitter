import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { deleteNotifications, getNotifications } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/GetNotification", protectRoute, getNotifications);
router.delete("/DeleteNotification", protectRoute, deleteNotifications);

export default router;