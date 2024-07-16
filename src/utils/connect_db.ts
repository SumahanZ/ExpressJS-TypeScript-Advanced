import mongoose from "mongoose";
import log from "../utils/logger";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URL!);
    log.info("Connected to DB");
  } catch (err) {
    log.error("Could not connect to DB");
    //exit with an error
    process.exit(1);
  }
}
