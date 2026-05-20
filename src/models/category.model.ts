//name:req,description optional

//category schema

//model

import mongoose, { Document } from "mongoose";

interface ICategorySchema extends Document {
  name: string;
  description?: string;
}

const categorySchema = new mongoose.Schema<ICategorySchema>(
  {
    name: {
      type: String,
      required: [true, "category name is required"],
      trim: true,
      minlength: [2, "category name must be at least 2 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
      minlength: [25, "min 25 character is needed"],
    },
    //todo image
  },
  { timestamps: true },
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
