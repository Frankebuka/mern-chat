import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  allNotification,
  sendNotification,
  deleteNotification,
} from "../controllers/notificationControllers.js";

const router = express.Router();

router.route("/").get(protect, allNotification);
router.route("/").post(protect, sendNotification);
router.route("/:id").delete(protect, deleteNotification);

export default router;
