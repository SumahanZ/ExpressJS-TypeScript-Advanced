import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

//currying
//so I dont need to pass a the second functions argument
const validateSchema =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      //allows us to create schemas to validate body, query, and params
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
      return;
    } catch (err: any) {
      return res.status(400).send(err.errors);
    }
  };

export default validateSchema;
