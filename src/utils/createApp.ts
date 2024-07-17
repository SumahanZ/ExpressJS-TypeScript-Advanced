import express, { Request, Response, NextFunction, Express } from "express";
import dotenv from "dotenv";
import { deserializeUser } from "../middlewares/deserializeUser";
import routeInitializer from "../routes_initializer";

export function createApp() {
  const app = express();
  dotenv.config();
  //by defining middleware here, it gets applied to every single endpoint for every request (global middleware)
  app.use(express.json());
  app.use(deserializeUser);
  routeInitializer(app);

  return app;
}
