import express from "express";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import {
  deleteUser,
  getUserById,
  getUsers,
} from "../controllers/userController.js";

const router = express.Router();
router.use(protect);

router.get("/", adminOnly, getUsers); // onlly admin can get all users
router.delete("/:id", adminOnly, deleteUser); // onlly admin can delete all user
router.get("/:id", getUserById); // admin or the same user can get user by id
export default router;
