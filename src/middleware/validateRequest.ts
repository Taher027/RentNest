import { NextFunction, Request, Response, RequestHandler } from "express";
import { ZodType } from "zod";

const validateRequest =
  (schema: ZodType): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("hit ");
    try {
      console.log(req.body);
      await schema.parseAsync(req.body);

      next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;
