import { FilterQuery, UpdateQuery } from "mongoose";
import { SessionDocument, SessionModel } from "../models/session_model";
import { signJWT, verifyJWT } from "../utils/jwt_utils";
import { get } from "lodash";
import { findUser } from "./user_service";

export async function createSession(userId: string, userAgent: string) {
  const session = await SessionModel.create({ user: userId, userAgent });
  return session.toJSON();
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
  //.lean() only return properties on the object
  return SessionModel.find(query).lean();
}

export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) {
  return SessionModel.updateOne(query, update);
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decodedToken } = verifyJWT(refreshToken);

  //we need the sessionId to make sure the session is still valid before we issue a new accessToken
  if (!decodedToken || !get(decodedToken, "session")) return false;

  const session = await SessionModel.findById(get(decodedToken, "session"));

  if (!session || !session.valid) return false;

  const user = await findUser({
    _id: session.user,
  });

  if (!user) return false;

  //create new access token here
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

  return accessToken;
}
