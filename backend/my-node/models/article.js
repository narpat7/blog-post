import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true }, // Make sure content is required
  // images: [String],
  images: [
    {
      data: Buffer,
      contentType: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0
  },
});

const Article = mongoose.model("Article", articleSchema);
export default Article;
