import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/ProductController.js";
import { validate } from "../validation/validation.js";
import { createProductSchema, updateProductSchema } from "../validation/validation.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();
// Admin routes
router.post("/",protect, adminOnly, validate(createProductSchema), createProduct);
router.put("/:id",protect, adminOnly, validate(updateProductSchema), updateProduct);
router.delete("/:id",protect, adminOnly, deleteProduct);
// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

export default router;
