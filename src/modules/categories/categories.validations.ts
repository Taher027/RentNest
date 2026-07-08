import { title } from "node:process";
import z, { string } from "zod";

export const categoriesSchema = z.object({
  title: string("Categori title is required!"),
});
