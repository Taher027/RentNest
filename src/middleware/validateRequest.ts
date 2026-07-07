import { NextFunction, Request, Response, RequestHandler } from "express";
import { ZodType } from "zod";

const validateRequest =
  (schema: ZodType): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("hi");
    try {
      console.log("inside validation before validation", req.body);
      req.body = await schema.parseAsync(req.body);

      console.log("aftervalidation", req.body);
      next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;
