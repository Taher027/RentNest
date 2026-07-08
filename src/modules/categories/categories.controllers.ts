import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { categoryServices } from "./categories.services";

const createCategories = catchAsync(async (req, res) => {
  const { title } = req.body;
  const result = await categoryServices.createCategoryToDB(title as string);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "category created successfull",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const result = await categoryServices.getAllCategoriesFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "category created successfull",
    data: result,
  });
});
export const categoriesControllers = {
  createCategories,
  getAllCategories,
};
