import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import { userRoute } from "./model/user/user.routes";
import globalErrorHandler from "./middleware/globalErroHandler";
import notFound from "./middleware/notFound";
const app: Application = express();
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.use("/api/auth", userRoute);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
