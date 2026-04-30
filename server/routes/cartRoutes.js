import express from "express";
import {protect } from "../middlewares/authMiddleware.js";
import { addToCart, clearCart, getCart, removeItem, updateQuantity } from "../controllers/cartController.js";

const router = express.Router();
router.use(protect);

router.post("/" ,addToCart)
router.get("/" ,getCart)
router.put("/:productId" ,updateQuantity)
router.delete("/" ,clearCart)
router.delete("/:productId" ,removeItem)

export default router;
