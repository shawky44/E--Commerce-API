import express from "express";
import {
  register,
  signIn,
  signOut,
  verifyVerificationCode,
  changePassword,
  sendForgetPasswordCode,
  verifyForgetPasswordCode,
  getUserProfile,
  updateEmail,
  updateProfileInfo,
  resendVerificationCode,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

// Define authentication routes

router.post("/register", register);
router.post("/signin", signIn);
router.post("/signout", protect, signOut);
router.get("/profile", protect, getUserProfile);
router.put("/profile/update-email", protect, updateEmail);
router.put("/profile", protect, updateProfileInfo);

router.patch("/resendVerificationCode", resendVerificationCode);
router.patch("/verifyVerificationCode", verifyVerificationCode);

router.patch("/changePassword", protect, changePassword);

router.patch("/sendforgetPasswordCode", sendForgetPasswordCode);
router.patch("/verifyforgetPasswordCode", verifyForgetPasswordCode);

export default router;
