import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { propertiesService } from "./properties.services";
import pick from "../../shared/pick";
import httpStatus from "http-status";

const createProperties = catchAsync(async (req, res) => {
  const payload = req.body;
  const landLoardId = req.user?.id;
  const result = await propertiesService.createPropertiesToDB(
    payload,
    landLoardId as string,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Properties create successfull",
    data: result,
  });
});

const getAllProperties = catchAsync(async (req, res) => {
  console.log(req.query, req.originalUrl);
  const filters = pick(req.query, [
    "searchTerm",
    "city",
    "minPrice",
    "maxPrice",
    "bedRooms",
    "status",
    "categoryId",
  ]);

  const result = await propertiesService.getAllPropertiesFromDB(filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Properties retrieved successfull",
    data: result,
  });
});
const getSingleProperties = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await propertiesService.getSinglePropertiesFromDB(
    id as string,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Property retrieved successfull",
    data: result,
  });
});
const updateProperties = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const result = await propertiesService.updatePropertiseToDB(
    userId as string,
    id as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Property updated successfull",
    data: result,
  });
});
const getAllOwnProperties = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await propertiesService.getallOwnPropertiesFromDB(
    userId as string,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Property updated successfull",
    data: result,
  });
});
const deleteProperties = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const role = req.user?.role;
  await propertiesService.deletePropertiesFromDB(
    userId as string,
    role as string,
    id as string,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Property deleted successfull",
  });
});
export const propertiesController = {
  createProperties,
  getAllProperties,
  getSingleProperties,
  updateProperties,
  getAllOwnProperties,
  deleteProperties,
};
