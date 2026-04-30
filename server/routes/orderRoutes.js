import express from "express";
import {
  cancelOrder,
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderDetails,
  updateOrderStatus,
} from "../controllers/orderController.js";

import { adminOnly, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

//    USER ROUTES
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);

//    ADMIN ROUTES
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

//    Dynamic Routes
router.get("/:id", protect, getOrderDetails);
router.put("/:id/cancel", protect, cancelOrder);


export default router;