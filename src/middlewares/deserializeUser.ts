import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { verifyJWT } from "../utils/jwt_utils";
import { reIssueAccessToken } from "../services/session_service";

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //get accessToken from the request headers
  //import get function from lodash to make it safer accessing a property if it exist or not
  //at the start of an authorization token, we gonna have the word Bearer, it gets access to the system, but we wanna remove that word
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  const refreshToken = get(req, "headers.x-refresh") as string;

  if (!accessToken) return next();
  //verify the accesstoken passed in the authorization headers with Bearer in the front
  //get the decodedToken object and attach to the response object the decodedToken object
  const { decodedToken, expired } = verifyJWT(accessToken);

  if (decodedToken) {
    res.locals.user = decodedToken;
    return next();
  }

  if (expired && refreshToken) {
    //reissue new accessToken here
    const newAccessToken = await reIssueAccessToken({ refreshToken });
    if (newAccessToken) {
      //set header with the new accessToken
      res.setHeader("x-access-token", newAccessToken);
    }
    const result = verifyJWT(newAccessToken as string);
    //attach to the res.locals.user with the new decoded object value from the new accesstoken
    res.locals.user = result.decodedToken;
    return next();
  }

  return next();
};
