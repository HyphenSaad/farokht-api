import { StatusCodes } from "http-status-codes";

import { User, Item,  Order } from "../models/index.js";

const createOrder = async (request, response, next) => {
  if (request.user.role === "vendor") {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: "You're Unauthorized To Perform This Operation!",
    };
  }

  const retailerUser = await User.findOne({ _id: request.order.retailerId });
  if (!retailerUser) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: "Invalid Vendor ID!",
    };
  }
  const vendorUser = await User.findOne({ _id: request.order.vendorId });
  if (!vendorUser) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: "Invalid Vendor ID!",
    };
  }

  const item = await Item.findOne({ _id: request.order.itemId });
  if (!item) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: "Invalid Vendor ID!",
    };
  }
};
