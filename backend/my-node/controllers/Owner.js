import Owner from "../models/Owner.js";
import HomeImage from "../models/homeimage.js";
import ProfileImage from "../models/profileimage.js";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendOtp } from "../utils/sendOtp.js";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import twilio from "twilio";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const createOwner = async (req, res) => {
  try {
    const existingAdmin = await Owner.findOne(); 
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists." });
    }

    const newOwner = new Owner({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    await newOwner.save();
    res.status(201).json({ message: "Admin created successfully." });

  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
};

export const Login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Check if it's an email or a phone number
    const isEmail = /\S+@\S+\.\S+/.test(emailOrPhone);
    const query = isEmail
      ? { email: emailOrPhone.trim().toLowerCase() }
      : { phone: emailOrPhone.trim() };

    const owner = await Owner.findOne(query);

    if (!owner) {
      return res.status(404).json({ message: "Owner not found." });
    }

    const isMatch = await owner.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is incorrect." });
    }

    const token = jwt.sign(
      { userId: owner._id, email: owner.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token: token,
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error." });
  }
};

export const verifyToken = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      res.status(200).json({ userId: decoded.userId, email: decoded.email });
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(401).json({ message: "Invalid token." });
    }
  }

//image secrion

export const uploadHomeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const newImage = new HomeImage({
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      }
    });

    await newImage.save();

    res.status(201).json({
      success: true,
      id: newImage._id,  // ⬅️ Use this in frontend to fetch later
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, error: "Upload failed" });
  }
};



export const getLatestHomeImage = async (req, res) => {
  try {
    const latestImage = await HomeImage.findOne().sort({ createdAt: -1 });
    if (!latestImage) {
      return res.status(404).json({ message: "No images found." });
    }

    res.status(200).json({ image: latestImage.image });
  } catch (error) {
    console.error("Error fetching latest image:", error);
    res.status(500).json({ error: "Server error." });
  }
};

export const getAllHomeImages = async (req, res) => {
  try {
    const images = await HomeImage.find().sort({ createdAt: -1 });
    res.status(200).json({ images });
  } catch (error) {
    console.error("Error fetching all images:", error);
    res.status(500).json({ error: "Server error." });
  }
};

// controllers/Owner.js
export const deleteHomeImage = async (req, res) => {
  try {
    const id = req.params.id;

    const deleted = await HomeImage.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Image not found." });
    }

    res.status(200).json({ success: true, message: "Image deleted." });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const getHomeImage = async (req, res) => {
  try {
    const id = req.params.id;
    const imageDoc = await HomeImage.findById(id);

    if (!imageDoc || !imageDoc.image || !imageDoc.image.data) {
      return res.status(404).send("Image not found");
    }

    res.set("Content-Type", imageDoc.image.contentType || "image/jpeg");
    res.send(imageDoc.image.data);  // ⬅️ Send raw image buffer
  } catch (error) {
    console.error("getHomeImage error:", error);
    res.status(500).send("Server error");
  }
};

//profileimage
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const imagePath = `/uploads/home/${req.file.filename}`;

    // ✅ Save image URL to MongoDB
const newImage = new ProfileImage({
  image: `/uploads/home/${req.file.filename}`, // ✅ This is important
});
    // const newImage = new HomeImage({ image: imagePath });
    await newImage.save();

    res.status(201).json({ success: true, imageUrl: imagePath });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ success: false, error: "Server error." });
  }
};

export const getLatestProfileImage = async (req, res) => {
  try {
    const latestImage = await ProfileImage.findOne().sort({ createdAt: -1 });
    if (!latestImage) {
      return res.status(404).json({ message: "No images found." });
    }

    res.status(200).json({ image: latestImage.image });
  } catch (error) {
    console.error("Error fetching latest image:", error);
    res.status(500).json({ error: "Server error." });
  }
};

