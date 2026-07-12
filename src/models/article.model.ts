import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    read_time: { type: String, required: true, trim: true },
    image: {
      path: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    href: { type: String, required: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Article = mongoose.model("article", articleSchema);
export default Article;
