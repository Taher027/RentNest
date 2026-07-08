import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { propertiesService } from "./properties.services";

const createProperties = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await propertiesService.createCategoriesToDB(payload);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Properties create successfull",
    data: result,
  });
});
export const propertiesController = {
  createProperties,
};
