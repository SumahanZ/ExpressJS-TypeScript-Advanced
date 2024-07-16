import { Request, Response } from "express";
import {
  CreateProductInput,
  DeleteProductInput,
  GetProductInput,
  UpdateProductInput,
} from "../schemas/product_schema";
import {
  createProduct,
  deleteProduct,
  findAndUpdateProduct,
  findProduct,
} from "../services/product_service";

export async function createProductHandler(
  req: Request<{}, {}, CreateProductInput["body"]>,
  res: Response
) {
  //access this from the attached object when logged in
  const userId = res.locals.user._id;
  const body = req.body;
  try {
    const product = await createProduct({ ...body, user: userId });
    return res.status(201).send(product);
  } catch (err) {
    return res.sendStatus(400);
  }
}

export async function updateProductHandler(
  req: Request<UpdateProductInput["params"], {}, UpdateProductInput["body"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const productId = req.params.productId;
  const body = req.body;
  try {
    const product = await findProduct({ productId });
    if (!product) return res.sendStatus(404);
    //the user that is created the product is not the one who is updating it
    if (String(product.user) !== userId) return res.sendStatus(403);

    const updatedProduct = await findAndUpdateProduct({ productId }, body, {
      new: true,
    });
    return res.status(200).send(updatedProduct);
  } catch (err) {
    return res.sendStatus(400);
  }
}

export async function getProductHandler(
  req: Request<GetProductInput["params"]>,
  res: Response
) {
  const productId = req.params.productId;
  try {
    const product = await findProduct({ productId });
    if (!product) return res.sendStatus(404);
    return res.status(200).send(product);
  } catch (err) {
    return res.sendStatus(400);
  }
}

export async function deleteProductHandler(
  req: Request<DeleteProductInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const productId = req.params.productId;

  try {
    const product = await findProduct({ productId });
    if (!product) return res.sendStatus(404);
    //the user that is created the product is not the one who is updating it
    if (String(product.user) !== userId) return res.sendStatus(403);
    await deleteProduct({ productId });
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(400);
  }
}
