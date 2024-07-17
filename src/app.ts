import express from "express";
import connectDB from "./utils/connect_db";
import dotenv from "dotenv";
import log from "./utils/logger";
import routeInitializer from "./routes_initializer";
import { deserializeUser } from "./middlewares/deserializeUser";
import { createApp } from "./utils/createApp";

const PORT = process.env.SERVER_PORT || 3002;

const app = createApp();

app.listen(PORT, async () => {
  log.info(`Listening at http://localhost:${PORT}`);
  await connectDB();
});
