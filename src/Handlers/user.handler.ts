import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/users.model";

// 🟢 Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.findAll();
    return res.json(
      users.map((u) => ({
        id: u.id,
        first_name: u.first_name,
        last_name: u.last_name,
      }))
    );
  } catch (err) {
    console.error("Get users error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Get user by id
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const users = await UserModel.findAll();
    const user = users.find((u) => u.id === parseInt(id));
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
    });
  } catch (err) {
    console.error("Get user error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Sign up user
export const signUpUser = async (req: Request, res: Response) => {
  const { firstName, last_name, password } = req.body;

  if (!firstName || !last_name || !password) {
    return res
      .status(400)
      .json({ message: "firstName, last_name and password required" });
  }

  try {
    // check if exists
    const existing = await UserModel.findByName(firstName, last_name);
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = await UserModel.create({
      first_name: firstName,
      last_name,
      password: hashedPassword,
    });

    // generate token
    const secret = process.env.JWT_SECRET || "dev_secret";
    const token = jwt.sign({ userId: newUser.id }, secret, { expiresIn: "1h" });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
      },
      token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Login
export const loginUser = async (req: Request, res: Response) => {
  const { firstName, first_name, lastName, last_name, password } = req.body;

  const finalFirstName = firstName || first_name;
  const finalLastName = lastName || last_name;

  if (!finalFirstName || !finalLastName || !password) {
    return res
      .status(400)
      .json({ message: "firstName, lastName and password required" });
  }

  try {
    const user = await UserModel.findByName(finalFirstName, finalLastName);
    console.log("user", user);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const secret = process.env.JWT_SECRET || "dev_secret";
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "1h" });

    return res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
