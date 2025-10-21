import express from "express";
import { register, login, getMe, getAllUsers } from "../controllers/auth_controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getMe);
router.get("/users", verifyToken, isAdmin, getAllUsers);

export default router;
