import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ProductModel } from "../models/product.model";

const productModel = new ProductModel();

// ✅ Get all products (Index)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productModel.index();
    return res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get single product by ID (Show)
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await productModel.show(Number(id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Create product (requires token)
export const createProduct = async (req: Request, res: Response) => {
  const { name, price, category } = req.body;

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token required" });

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }

  try {
    const newProduct = await productModel.create({ name, price, category });
    return res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error creating product:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Top 5 most popular products
export const topProducts = async (req: Request, res: Response) => {
  try {
    const products = await productModel.topProducts();
    return res.json(products);
  } catch (err) {
    console.error("Error fetching top products:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Products by category
export const getProductsByCategory = async (req: Request, res: Response) => {
  const { category } = req.params;
  try {
    const products = await productModel.productsByCategory(category);
    return res.json(products);
  } catch (err) {
    console.error("Error fetching products by category:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
