import express from "express";
import {
  getUserById,
  getUsers,
  loginUser,
  signUpUser,
} from "../Handlers/user.handler";
import authMiddleware from "../middleware/auth";

const router = express.Router();

// Routes
router.post("/signUp", signUpUser);
router.post("/login", loginUser);
// Protected routes
router.get("/", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUserById);
export default router;
