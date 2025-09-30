import express from "express";
import {
  createOrder,
  addProductToOrder,
  getCurrentOrderByUser,
  getCompletedOrdersByUser,
  updateOrderStatus,
} from "../Handlers/Orders.handler";
import authMiddleware from "../middleware/auth";

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.post("/addProduct", authMiddleware, addProductToOrder);
router.get("/current", authMiddleware, getCurrentOrderByUser);
router.get("/completed", authMiddleware, getCompletedOrdersByUser);
router.put("/updateStatus", updateOrderStatus);

export default router;
