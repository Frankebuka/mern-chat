import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import { errorHandler } from "./errorMiddleware.js";

export const protect = asyncHandler(async (req, res, next) => {
  // // use this code if you want to get token from headers instead of cookies:
  // let token;
  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer")
  // ) {
  //   try {
  //     token = req.headers.authorization.split(" ")[1];

  //     const decoded = jwt.verify(token, process.env.JWT_SECRET);

  //     const user = await User.findById(decoded.id).select("-password");

  //     const newUser = {
  //       id: decoded.id,
  //       ...user._doc,
  //     };

  //     req.user = newUser;

  //     next();
  //   } catch (error) {
  //     res.status(401);
  //     throw new Error("Not authorized, token failed");
  //   }
  // }
  // if (!token) return next(errorHandler(401, "Not authorized, no token"));

  //   Or use this code below if you want to get token from cookies after installing cookie-parser:
  try {
    const token = req.cookies.access_token;

    if (!token) return next(errorHandler(401, "Unauthorized"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    const newUser = {
      id: decoded.id,
      ...user._doc,
    };

    req.user = newUser;

    next();
  } catch (error) {
    next(errorHandler(401, "Not authorized, token failed"));
  }
});
