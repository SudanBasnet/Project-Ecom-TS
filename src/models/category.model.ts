import mongoose, { Document } from "mongoose";

interface ICategorySchema extends Document {
  name: string;
  description?: string;
  image: {
    path: string;
    public_id: string;
  };
}

//* category schema
const categorySchema = new mongoose.Schema<ICategorySchema>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      minLength: [25, "minimum 25 char. is required"],
    },
    image: [
      {
        type: {
          path: {
            type: String,
            required: true,
          },
          public_id: {
            type: String,
            required: true,
          },
        },
        required: [true, "image is required"],
      },
    ],
  },
  { timestamps: true },
);

//? model
const Category = mongoose.model("category", categorySchema);
export default Category;
