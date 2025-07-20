import express from "express";
import multer from "multer";
import {
  addArticle,
  getAllArticles,
  getArticleById,
  deleteArticle,
  editArticle,
  toggleLike,
  getArticleImage, 
} from "../controllers/article.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Use memory storage — images saved in MongoDB, not disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Routes
router.post("/add", authMiddleware, upload.array("images"), addArticle);           // Add article
router.get("/allarticles", getAllArticles);                                        // Get all articles
router.get("/article/:id", getArticleById);                                        // Get article by ID
router.get("/image/:id/:index", getArticleImage);                                  // ✅ Serve image from MongoDB buffer
router.delete("/delete/:id", authMiddleware, deleteArticle);                       // Delete article
router.put("/article/edit/:id", authMiddleware, upload.array("images"), editArticle); // Edit article
router.post("/like/:id", toggleLike);                                              // Like/unlike

export default router;
