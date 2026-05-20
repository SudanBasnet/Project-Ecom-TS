//models/brand.model.ts

import mongoose, { Document } from "mongoose";

export interface IBrand extends Document {
  name: string;
  description?: string;
}

const brandSchema = new mongoose.Schema<IBrand>(
  {
    name: {
      type: String,
      required: [true, "brand name is required"],
      trim: true,
      minlength: [2, "brand name must be at least 2 characters"],
      unique: true,
    },

    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Brand = mongoose.model<IBrand>("Brand", brandSchema);

export default Brand;
