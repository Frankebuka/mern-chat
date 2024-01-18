import asyncHandler from "express-async-handler";
import Notification from "../models/notificationModel.js";

const allNotification = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.find({
      receiver: req.user.id,
    }).lean();

    res.json(notifications);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const sendNotification = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  try {
    const notification = await Notification.create(message);
    res.json(notification);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const deleteNotification = asyncHandler(async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    res.json(notification);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export { allNotification, sendNotification, deleteNotification };
