import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import { UserDocument } from "./user_model";

//create customalphabet for our nanoid
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

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
      default: () => `product_${nanoid}`,
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
