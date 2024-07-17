import { Express, Request, Response } from "express";
import sessionRouter from "./routes/session_route";
import userRouter from "./routes/user_route";
import productRouter from "./routes/product_route";

function route(app: Express) {
  app.use(userRouter);
  app.use(sessionRouter);
  app.use(productRouter);
}

export default route;
