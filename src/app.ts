import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import { userAdminRoute, userRoute } from "./modules/user/user.routes";
import globalErrorHandler from "./middleware/globalErroHandler";
import notFound from "./middleware/notFound";
import { authRouter } from "./modules/auth/auth.routes";
import { categoriesRoute } from "./modules/categories/categories.routes";
import { propertiesRoutes } from "./modules/properties/properties.routes";
import { rentalRequestRoutes } from "./modules/rentalRequest/rentalRequest.routes";
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
app.use("/api/admin", userAdminRoute);
app.use("/api/auth", authRouter);
app.use("/api", categoriesRoute);
app.use("/api", propertiesRoutes);
app.use("/api", rentalRequestRoutes);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
