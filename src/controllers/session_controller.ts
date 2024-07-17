import { Request, Response } from "express";
import { validatePassword } from "../services/user_service";
import {
  createSession,
  findSessions,
  updateSession,
} from "../services/session_service";
import { signJWT } from "../utils/jwt_utils";

export async function createUserSessionHandler(req: Request, res: Response) {
  //Validate the user's password
  const user = await validatePassword(req.body);
  if (!user) return res.status(401).send("Invalid email or password");
  //Create a login session
  //attempt to get the user-agent from the req.object or set it into an empty string
  const session = await createSession(user.id, req.get("user-agent") || "");

  //Create an access token
  //pass a jwt payload
  const accessToken = signJWT(
    {
      //attach these info to the access token
      ...user,
      session: session._id,
    },
    {
      expiresIn: process.env.ACCESS_TOKEN_LIVE, //15 min of access token lifespan
    }
  );
  //Create a refresh token
  const refreshToken = signJWT(
    {
      //attach these info to the refresh token
      ...user,
      session: session._id,
    },
    {
      expiresIn: process.env.REFRESH_TOKEN_LIVE, //15 min of access token lifespan
    }
  );
  //Return access & refresh token
  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user.id;
  //get only valid session from a specific user based on the accessToken
  const sessions = await findSessions({ user: userId, valid: true });
  return res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;

  //we are not going to actually delete the session in the database, we are just gonna set the valid to false
  //so when the user try to use it again, they won't be able to use it again
  await updateSession({ _id: sessionId }, { valid: false });

  return res.status(200).send({ msg: "Successfully invalidate session!" });
}
