import { Router } from "express";
import requireUser from "../middlewares/requireUser";
import validateSchema from "../middlewares/validateSchema";
import {
  createProductInputSchema,
  deleteProductInputSchema,
  getProductInputSchema,
  updateProductInputSchema,
} from "../schemas/product_schema";
import {
  createProductHandler,
  deleteProductHandler,
  getProductHandler,
  updateProductHandler,
} from "../controllers/product_controller";

const router = Router();

router.post(
  "/api/products",
  [requireUser, validateSchema(createProductInputSchema)],
  createProductHandler
);

router.get(
  "/api/products/:productId",
  validateSchema(getProductInputSchema),
  getProductHandler
);

router.put(
  "/api/products/:productId",
  [requireUser, validateSchema(updateProductInputSchema)],
  updateProductHandler
);

router.delete(
  "/api/products/:productId",
  [requireUser, validateSchema(deleteProductInputSchema)],
  deleteProductHandler
);

export default router;
