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
      isOnline: true,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    if (user)
      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(201)
        .json({
          _id: user._id,
          name: user.name,
          email: user.email,
          pic: user.pic,
          isAdmin: user.isAdmin,
          token,
          createdAt: user.createdAt,
          isOnline: user.isOnline,
        });
  } catch (error) {
    next(error);
  }
});

const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(errorHandler(400, "Please fill in all fields"));

  try {
    const user = await User.findOne({ email });

    if (!user) return next(errorHandler(404, "User not found!"));

    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        isOnline: true,
      },
      {
        new: true,
      }
    ).select("-password");

    // const { password: pass, ...rest } = updatedUser._doc;

    if (updatedUser && validPassword)
      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          pic: updatedUser.pic,
          isAdmin: updatedUser.isAdmin,
          token,
          createdAt: updatedUser.createdAt,
          isOnline: updatedUser.isOnline,
        });
  } catch (error) {
    next(error);
  }
});

const Logout = async (req, res, next) => {
  const { userId } = req.body;
  try {
    if (userId) {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          isOnline: false,
        },
        {
          new: true,
        }
      ).select("-password");
      res.clearCookie("access_token");
      res.status(200).json("User has been logged out!");
    }
  } catch (error) {
    next(error);
  }
};

const allUsers = asyncHandler(async (req, res, next) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

  res.send(users);
});

const updateUser = asyncHandler(async (req, res, next) => {
  const { img, pic } = req.body;

  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      pic: img === undefined ? pic : img,
    },
    {
      new: true,
    }
  ).select("-password");

  const token = jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  if (!updatedUser) {
    res.status(404);
    throw new Error("User Not Found");
  } else {
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      pic: updatedUser.pic,
      token,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      isOnline: updateUser.isOnline,
    });
  }
});

export { registerUser, authUser, Logout, allUsers, updateUser };
