import mongoose from "mongoose";
import bcrypt from "bcrypt";
import log from "../utils/logger";

export interface UserInput {
  email: string;
  name: string;
  password: string;
}

//create typescript definition for the schema
export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: mongoose.Schema.Types.String,
      required: true,
      unique: true,
    },
    name: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    password: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  //before saving to database, we want to hash the password here
  let user = this as UserDocument;
  //if the pre-save is not modifying the password
  if (!user.isModified("password")) return next();
  //if modifying the password
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS!));
  const hashedPassword = bcrypt.hashSync(user.password, salt);
  user.password = hashedPassword;
  return next();
});

//give the user schema method to comparePassword definition
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  //refers to the schema it is calling
  const user = this as UserDocument;
  try {
    return await bcrypt.compare(candidatePassword, user.password);
  } catch (err) {
    log.error(err);
    return false;
  }
};

//give generic <UserDocument> so it can access the types
export const UserModel = mongoose.model<UserDocument>("User", userSchema);
