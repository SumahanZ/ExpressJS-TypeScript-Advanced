import { omit } from "lodash";
import { UserDocument, UserInput, UserModel } from "../models/user_model";
import { FilterQuery } from "mongoose";

export async function createUser(input: UserInput) {
  try {
    const user = await UserModel.create(input);
    //Use lodash omit function to omit specific property from our returned object. We don't wanna return the password to the response
    return omit(user.toJSON(), "password");
  } catch (err: any) {
    //rethrow equivalent
    throw new Error(err);
  }
}

//could return boolean false or an object
export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await UserModel.findOne({ email });

  if (!user) return false;

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), "password");
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}
