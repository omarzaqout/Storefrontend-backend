import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { OrderModel, OrderProductModel } from "../models/order.model";

const orderModel = new OrderModel();
const orderProductModel = new OrderProductModel();

// 🟢 Create new order
export const createOrder = async (req: Request, res: Response) => {
  const { userId, status } = req.body;

  if (!userId || !status) {
    return res.status(400).json({ message: "userId and status required" });
  }

  try {
    const order = await orderModel.create({ user_id: userId, status });
    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    console.error("Create order error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Add product to order
export const addProductToOrder = async (req: Request, res: Response) => {
  const { orderId, productId, quantity } = req.body;

  if (!orderId || !productId || !quantity) {
    return res
      .status(400)
      .json({ message: "orderId, productId and quantity required" });
  }

  try {
    const orderProduct = await orderProductModel.addProduct({
      order_id: orderId,
      product_id: productId,
      quantity,
    });
    return res.status(201).json({
      message: "Product added to order",
      orderProduct,
    });
  } catch (err) {
    console.error("Add product to order error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Current active order by user (token required)
export const getCurrentOrderByUser = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token required" });

  const token = authHeader.split(" ")[1];
  let decoded: any;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const userId = decoded.userId;

  try {
    const order = await orderModel.currentOrderByUser(userId);
    if (!order) return res.json({ message: "No active order found" });

    const products = await orderProductModel.getProductsByOrder(order.id!);
    return res.json({ order, products });
  } catch (err) {
    console.error("Get current order error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Completed orders by user (token required)
export const getCompletedOrdersByUser = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token required" });

  const token = authHeader.split(" ")[1];
  let decoded: any;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const userId = decoded.userId;

  try {
    const orders = await orderModel.completedOrdersByUser(userId);
    return res.json(orders);
  } catch (err) {
    console.error("Get completed orders error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Update order status (active <-> complete)
export const updateOrderStatus = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token required" });

  const token = authHeader.split(" ")[1];
  let decoded: any;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // دعم camelCase و snake_case
  const { orderId, order_id, status } = req.body;
  const finalOrderId = orderId || order_id;

  if (!finalOrderId || !status) {
    return res.status(400).json({ message: "orderId and status required" });
  }

  const allowedStatuses = ["active", "complete"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: `Invalid status value. Allowed: ${allowedStatuses.join(", ")}`,
    });
  }

  try {
    const order = await orderModel.updateStatus(finalOrderId, status);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (err) {
    console.error("Update order status error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
