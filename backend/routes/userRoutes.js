import express from "express";
import {
  authUser,
  registerUser,
  Logout,
  allUsers,
  updateUser,
} from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);
router.post("/logout", protect, Logout);
router.post("/update/:id", protect, updateUser);

export default router;
