import express from 'express';
import multer from "multer";
import path from "path";
import fs from "fs";
import { 
  createOwner,
  Login, 
  uploadHomeImage, 
  getLatestHomeImage, 
  uploadProfileImage, 
  getLatestProfileImage, 
  getAllHomeImages, 
  deleteHomeImage,
  getHomeImage,
} from '../controllers/Owner.js';
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/add', createOwner); 
router.post('/login', Login);
router.post('/home/image', upload.single("image"), uploadHomeImage);
router.get('/home/latest-image', getLatestHomeImage);
router.post('/profile/image',authMiddleware, upload.single("image"), uploadProfileImage);
router.get('/profile/latest-image',authMiddleware , getLatestProfileImage);
router.get('/home/images', getAllHomeImages);
router.delete('/home/image/:id',authMiddleware , deleteHomeImage);
router.get('/home-image/:id', getHomeImage);

export default router;
