import { object, string, TypeOf, number } from "zod";

const body = object({
  title: string({
    required_error: "Title is required",
  }),
  description: string({
    required_error: "Description is required",
  }).min(120, "Description should be at least 120 characters long"),
  price: number({
    required_error: "Price is required",
  }),
  image: string({
    required_error: "Image is required",
  }),
});

const params = object({
  productId: string({
    required_error: "Product Id is required",
  }),
});

export const createProductInputSchema = object({
  body: body,
});

export const updateProductInputSchema = object({
  body: body,
  params: params,
});

export const deleteProductInputSchema = object({
  params: params,
});

export const getProductInputSchema = object({
  params: params,
});

//type inference by zod
export type CreateProductInput = TypeOf<typeof createProductInputSchema>;
export type UpdateProductInput = TypeOf<typeof updateProductInputSchema>;
export type DeleteProductInput = TypeOf<typeof deleteProductInputSchema>;
export type GetProductInput = TypeOf<typeof getProductInputSchema>;
