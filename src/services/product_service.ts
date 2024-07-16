import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import {
  ProductDocument,
  ProductInput,
  ProductModel,
} from "../models/product_model";

export async function createProduct(input: ProductInput) {
  return ProductModel.create(input);
}

export async function findProduct(
  query: FilterQuery<ProductDocument>,
  options?: QueryOptions
) {
  return ProductModel.findOne(query, {}, options).lean();
}

export async function findAndUpdateProduct(
  query: FilterQuery<ProductDocument>,
  update: UpdateQuery<ProductDocument>,
  options: QueryOptions
) {
  return ProductModel.findOneAndUpdate(query, update, options);
}

export async function deleteProduct(query: FilterQuery<ProductDocument>) {
  return ProductModel.deleteOne(query);
}
