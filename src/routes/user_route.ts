import { Router } from "express";
import { createUserHandler } from "../controllers/user_controller";
import validateSchema from "../middlewares/validateSchema";
import { createUserInputSchema } from "../schemas/user_schema";

const router = Router();

router.post(
  "/api/users",
  validateSchema(createUserInputSchema),
  createUserHandler
);

//
router.use("/api", router);
export default router;
