import mongoose from "mongoose";
import { UserDocument } from "./user_model";

//create typescript definition for the schema
export interface SessionDocument extends mongoose.Document {
  //reference the UserDocument id field
  user: UserDocument["_id"];
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const sessionSchema = new mongoose.Schema(
  {
    //refer to another object from a specific collection
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    valid: {
      type: mongoose.Schema.Types.Boolean,
      default: true,
    },
    userAgent: {
      type: mongoose.Schema.Types.String,
    },
  },
  {
    timestamps: true,
  }
);

export const SessionModel = mongoose.model<SessionDocument>(
  "Session",
  sessionSchema
);
