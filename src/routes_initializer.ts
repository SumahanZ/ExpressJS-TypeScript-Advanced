import { Express, Request, Response } from "express";
import sessionRouter from "./routes/session_route";
import userRouter from "./routes/user_route";
import productRouter from "./routes/product_route";

function route(app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => {
    return res.sendStatus(200);
  });

  app.use(userRouter);
  app.use(sessionRouter);
  app.use(productRouter);
}

export default route;
