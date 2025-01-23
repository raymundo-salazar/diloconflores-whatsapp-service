import { Request, Response } from "express";
import User from "@models/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // const newUser = await User.create({
    //   firstName,
    //   lastName,
    //   email,
    //   password: hashedPassword,
    // });
    res.status(201).json({ message: "User registered successfully", user: {} });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
};
