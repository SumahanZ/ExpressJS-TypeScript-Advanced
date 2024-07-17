import { Router } from "express";
import validateSchema from "../middlewares/validateSchema";
import {
  createUserSessionHandler,
  getUserSessionsHandler,
  deleteSessionHandler,
} from "../controllers/session_controller";
import requireUser from "../middlewares/requireUser";
import { createSessionSchema } from "../schemas/session_schema";

const router = Router();

router.post(
  "/api/sessions",
  validateSchema(createSessionSchema),
  createUserSessionHandler
);

router.get("/api/sessions", requireUser, getUserSessionsHandler);

router.delete("/api/sessions", requireUser, deleteSessionHandler);

// router.use("/api", router);

export default router;
