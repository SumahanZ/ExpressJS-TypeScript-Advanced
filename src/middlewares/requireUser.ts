import { NextFunction, Request, Response } from "express";

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  //middleware that is going to validate if the user exist for the given request
  const user = res.locals.user;
  //if user doesnt exist or not attached it will return 403
  if (!user) return res.sendStatus(403);

  return next();
};

export default requireUser;
