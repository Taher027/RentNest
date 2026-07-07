import { Request, Response, NextFunction } from "express";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "API Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "The requested route does not exist.",
      },
    ],
  });
};

export default notFound;
