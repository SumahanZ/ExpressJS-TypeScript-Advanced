import { Request, Response } from "express";
import { omit } from "lodash";
import log from "../utils/logger";
import { createUser } from "../services/user_service";
import { CreateUserInput } from "../schemas/user_schema";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    //call crate user service here
    const user = await createUser(req.body);
    //In express, you have to call your response object
    return res.send(user);
  } catch (err: any) {
    log.error(err);
    //409 means conflict, if this function throws, it throws because it violated the unique restriction
    return res.status(409).send(err.message);
  }
}
