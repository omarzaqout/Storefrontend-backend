import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  topProducts,
  getProductsByCategory,
} from "../Handlers/Products.handler";
import authMiddleware from "../middleware/auth";

const router = express.Router();

// /api/products
router.get("/", getProducts); // Index
router.get("/:id", getProductById); // Show
router.post("/", authMiddleware, createProduct); // Create [token required]
router.get("/top/popular", topProducts); // Optional: Top 5
router.get("/category/:category", getProductsByCategory); // Optional: by category

export default router;
