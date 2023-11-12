import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../middleware/errorMiddleware.js";

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      pic,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const { password: pass, ...rest } = user._doc;

    if (user)
      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(201)
        .json(rest);
  } catch (error) {
    next(error);
  }
});

const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  try {
    const user = await User.findOne({ email });

    if (!user) return next(errorHandler(404, "User not found!"));

    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const { password: pass, ...rest } = user._doc;

    if (user && validPassword)
      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
  } catch (error) {
    next(error);
  }
});

export { registerUser, authUser };
