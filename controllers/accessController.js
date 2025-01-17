import tryCatchWrapper from "../wrappers/tryCatchWrapper.js";
import jwt from "jsonwebtoken";
import { failedResponse } from "../wrappers/response.js";
import "dotenv/config";
import user from "../models/userModel.js";
import AdminUser from "../models/admin_model.js";

export const protect = tryCatchWrapper(async (req, res, next) => {
  const GetToken = req.headers.authorization;
  if (!GetToken) {
    return failedResponse(res, "token not available in header!");
  }
  const token = GetToken.split(" ")[1];
  if (!token) {
    return failedResponse(res, "User Not Authenticated!");
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRECT_KEY);
  if (!decodedToken) {
    return failedResponse(res, "Unable To decode token");
  }
  const findUser = await AdminUser.findById(decodedToken.userId);
  const user2 = await user.findById(decodedToken.userId);
  if (!findUser && !user2) {
    return failedResponse(res, "User Not Found");
  }
  console.log('====================================');
  console.log(`current logedin user ${user2} ----> ${findUser}`);
  console.log('====================================');
  req.userId = findUser!==null ?findUser._id : user2._id;




  next();
});
export const protect2 = tryCatchWrapper(async (req, res, next) => {
  const GetToken = req.headers.authorization;
  if (!GetToken) {
    return failedResponse(res, "token not available in header!");
  }
  const token = GetToken.split(" ")[1];
  if (!token) {
    return failedResponse(res, "User Not Authenticated!");
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRECT_KEY);
  if (!decodedToken) {
    return failedResponse(res, "Unable To decode token");
  }
  const findUser = await user.findById(decodedToken.userId);
  if (!findUser) {
    return failedResponse(res, "User Not Found");
  }
  req.userId = findUser._id;
  next();
});

export const adminProtect = tryCatchWrapper(async (req, res, next) => {
  const GetToken = req.headers.authorization;
  if (!GetToken) {
    return failedResponse(res, "token not available in header!",401);
  }
  const token = GetToken.split(" ")[1];
  if (!token) {
    return failedResponse(res, "User Not Authenticated!",401);
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRECT_KEY);
  if (!decodedToken) {
    return failedResponse(res, "Unable To decode token",401);
  }

  const adminUser = await AdminUser.findById(decodedToken.userId);

  if (!adminUser) {
    return failedResponse(res, "Admin Not Found",401);
  }
  if (!adminUser.role=='admin') {
    return failedResponse(res, "This is not admin account!",401);
  }
  req.userId = adminUser._id;
  next();
});
