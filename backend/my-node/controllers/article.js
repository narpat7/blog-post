// import Article from "../models/article.js";
// import path from "path";
// import fs from "fs";

// export const addArticle = async (req, res) => {
//   try {
//     const { title, category, content } = req.body;

//     if (!title || !category || !content) {
//       return res.status(400).json({ error: "Title, category and content are required." });
//     }

//     // const images = req.files?.map((file) => `/uploads/${file.filename}`) || [];

//      // ✅ Get image buffers from memory
//     const images = req.files?.map(file => ({
//       data: file.buffer,
//       contentType: file.mimetype
//     })) || [];

//     const newArticle = new Article({ title, category, content, images });
//     const savedArticle = await newArticle.save();

//     res.status(201).json(savedArticle);
//   } catch (error) {
//     console.error("Error in addArticle:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };


// export const getAllArticles = async (req, res) => {
//   try {
//     const articles = await Article.find();
//     res.status(200).json(articles);
//   } catch (error) {
//     console.error("Error in getAllArticles:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// export const getArticleById = async (req, res) => {
//   try {
//     const article = await Article.findById(req.params.id);
//     if (!article) {
//       return res.status(404).json({ error: "Article not found" });
//     }
//     res.status(200).json(article);
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// };


// export const deleteArticle = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const article = await Article.findByIdAndDelete(id);
//     if (!article) {
//       return res.status(404).json({ error: "Article not found" });
//     }
//     res.status(200).json({ message: "Article deleted successfully" });
//   } catch (error) {
//     console.error("Error in deleteArticle:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// } 

// export const editArticle = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, category, content } = req.body;
//     const deletedImages = JSON.parse(req.body.deletedImages || "[]");

//     if (!title || !category || !content) {
//       return res.status(400).json({ error: "Title, category, and content are required." });
//     }

//     const newImages = Array.isArray(req.files)
//       ? req.files.map((file) => `/uploads/${file.filename}`)
//       : [];

//     const existingArticle = await Article.findById(id);
//     if (!existingArticle) {
//       return res.status(404).json({ error: "Article not found." });
//     }

//     // 🧹 Remove deleted images from filesystem
//     deletedImages.forEach((imgPath) => {
//       const fullPath = path.join("public", imgPath); // adjust if 'uploads/' is not inside 'public/'
//       if (fs.existsSync(fullPath)) {
//         fs.unlinkSync(fullPath);
//       }
//     });

//     // 🔁 Update images: remove deleted ones, add new ones
//     existingArticle.images = existingArticle.images
//       .filter((img) => !deletedImages.includes(img))
//       .concat(newImages);

//     // 📝 Update other fields
//     existingArticle.title = title;
//     existingArticle.category = category;
//     existingArticle.content = content;

//     const updatedArticle = await existingArticle.save();

//     res.status(200).json(updatedArticle);
//   } catch (error) {
//     console.error("Error in editArticle:", error.message);
//     res.status(500).json({ error: "Internal server error." });
//   }
// };
  

// export const toggleLike = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { isLiked } = req.body; // true = like, false = unlike

//     const article = await Article.findById(id);
//     if (!article) return res.status(404).json({ error: "Article not found" });

//     if (isLiked) {
//       article.likes += 1;
//     } else {
//       article.likes = Math.max(article.likes - 1, 0);
//     }

//     await article.save();

//     res.status(200).json({ likes: article.likes });
//   } catch (err) {
//     console.error("❌ toggleLike error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // This function handles adding a new article to the database.

import Article from "../models/article.js";

// ✅ Add New Article (with image buffer)
export const addArticle = async (req, res) => {
  try {
    const { title, category, content } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({ error: "Title, category and content are required." });
    }

    const images = req.files?.map(file => ({
      data: file.buffer,
      contentType: file.mimetype
    })) || [];

    const newArticle = new Article({ title, category, content, images });
    const savedArticle = await newArticle.save();

    res.status(201).json(savedArticle);
  } catch (error) {
    console.error("Error in addArticle:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get All Articles
export const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (error) {
    console.error("Error in getAllArticles:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get Article by ID
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete Article
export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findByIdAndDelete(id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error in deleteArticle:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Edit Article (update content + add/remove image buffers)
export const editArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, content } = req.body;
    const deletedIndexes = JSON.parse(req.body.deletedIndexes || "[]");

    if (!title || !category || !content) {
      return res.status(400).json({ error: "Title, category, and content are required." });
    }

    const newImages = req.files?.map(file => ({
      data: file.buffer,
      contentType: file.mimetype
    })) || [];

    const existingArticle = await Article.findById(id);
    if (!existingArticle) {
      return res.status(404).json({ error: "Article not found." });
    }

    // ❌ Remove deleted image indexes
    existingArticle.images = existingArticle.images.filter((_, index) => !deletedIndexes.includes(index));

    // ➕ Add new image buffers
    existingArticle.images.push(...newImages);

    // 📝 Update text fields
    existingArticle.title = title;
    existingArticle.category = category;
    existingArticle.content = content;

    const updatedArticle = await existingArticle.save();
    res.status(200).json(updatedArticle);
  } catch (error) {
    console.error("Error in editArticle:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

// ✅ Toggle Like (Increment/Decrement)
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { isLiked } = req.body; // true = like, false = unlike

    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ error: "Article not found" });

    article.likes = isLiked ? article.likes + 1 : Math.max(article.likes - 1, 0);
    await article.save();

    res.status(200).json({ likes: article.likes });
  } catch (err) {
    console.error("❌ toggleLike error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Serve Image Buffer by ID + Index
export const getArticleImage = async (req, res) => {
  try {
    const { id, index } = req.params;
    const article = await Article.findById(id);

    if (!article || !article.images || !article.images[index]) {
      return res.status(404).send("Image not found");
    }

    const image = article.images[index];
    res.set("Content-Type", image.contentType);
    res.send(image.data);
  } catch (error) {
    console.error("getArticleImage error:", error);
    res.status(500).send("Server error");
  }
};
