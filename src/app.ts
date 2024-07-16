import express from "express";
import connectDB from "./utils/connect_db";
import dotenv from "dotenv";
import log from "./utils/logger";
import routeInitializer from "./routes_initializer";
import { deserializeUser } from "./middlewares/deserializeUser";

const app = express();
dotenv.config();

//by defining middleware here, it gets applied to every single endpoint for every request (global middleware)
app.use(express.json());
app.use(deserializeUser);

const PORT = process.env.SERVER_PORT || 3002;

app.listen(PORT, async () => {
  log.info(`Listening at http://localhost:${PORT}`);
  await connectDB();
  routeInitializer(app);
});
