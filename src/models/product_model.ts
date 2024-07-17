import mongoose from "mongoose";
import { UserDocument } from "./user_model";
import { customAlphabet } from "../utils/generate_unique_id";

//create customalphabet for our nanoid

export interface ProductInput {
  user: UserDocument["_id"];
  title: string;
  description: string;
  price: number;
  image: string;
}

//create typescript definition for the schema
//something that the user can enter or input
export interface ProductDocument extends ProductInput, mongoose.Document {
  //user that created the product
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema(
  {
    //not included in the ProductDocument type
    productId: {
      type: mongoose.Schema.Types.String,
      required: true,
      unique: true,
      default: () =>
        `product_${customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10)}`,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    description: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    price: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    image: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ProductModel = mongoose.model<ProductDocument>(
  "Product",
  productSchema
);
