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
  "/products",
  [requireUser, validateSchema(createProductInputSchema)],
  createProductHandler
);

router.get(
  "/products/:productId",
  [requireUser, validateSchema(getProductInputSchema)],
  getProductHandler
);

router.put(
  "/products/:productId",
  [requireUser, validateSchema(updateProductInputSchema)],
  updateProductHandler
);

router.delete(
  "/products/:productId",
  [requireUser, validateSchema(deleteProductInputSchema)],
  deleteProductHandler
);

router.use("/api", router);

export default router;
