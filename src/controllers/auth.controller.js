import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import { TOKEN_SECRET } from "../config.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json(["Email already in use"]);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    const registeredUser = await newUser.save();

    const token = await createAccessToken({ id: registeredUser._id });

    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });

    res.json({
      id: registeredUser._id,
      username: registeredUser.username,
      email: registeredUser.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });

    if (!userFound) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const token = await createAccessToken({ id: userFound._id });

    res.cookie("token", token, {
      secure: true,
      sameSite: "none",
    });

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: process.env.NODE_ENV !== "development",
    secure: true,
    sameSite: "none",
    expires: new Date(0),
  });
  return res.status(200).json({ message: "User logged out" });
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);

  if (!userFound) {
    return res.status(400).json({ message: "User not found" });
  }

  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token)
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err)
      return res
        .status(401)
        .json({ message: "Unauthorized, invalid token provided" });

    const userFound = await User.findById(user.id);
    if (!userFound)
      return res.status(401).json({ message: "Unauthorized. User not found" });

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  });
};
