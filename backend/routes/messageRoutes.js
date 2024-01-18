import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  allMessages,
  sendMessage,
  updatedMessage,
} from "../controllers/messageControllers.js";

const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/update").put(protect, updatedMessage);
router.route("/:chatId").get(protect, allMessages);

export default router;
