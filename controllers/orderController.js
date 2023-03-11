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

const updateOrder = async (request, response, next) =>{}
const deleteOrder = async (request, response, next) =>{}
const getOrder = async (request, response, next) =>{}
const getAllOrders = async (request, response, next) =>{
  const page = request.query.page || 1
  const limit = request.query.limit || 10

  if (request.user.role === 'admin') {
    response.status(StatusCodes.OK).json({message:'All Orders'})
  }
}

const getAllOrdersOfVendor = (request, response, next) => {}
const getAllOrdersOfRetailer = (request, response, next) => {}


export {createOrder, updateOrder, deleteOrder, getOrder, getAllOrders}