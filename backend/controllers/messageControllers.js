import asyncHandler from "express-async-handler";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";

const sendMessage = asyncHandler(async (req, res, next) => {
  const { chatId, content, pic } = req.body;

  if (!chatId || (!content && !pic)) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content,
    pic,
    unread: true,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message._id,
    });
    message = await message.populate({
      path: "chat",
      populate: [{ path: "latestMessage", select: "_id" }],
    });

    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const updatedMessage = asyncHandler(async (req, res) => {
  const { messageId, chatId } = req.body;

  const updatedChat = await Message.findByIdAndUpdate(
    messageId,
    { unread: false },
    { new: true }
  );

  if (!updatedChat) {
    res.status(404);
    throw new Error("Message Not Found");
  }

  const chatUpdate = await Chat.findByIdAndUpdate(
    chatId,
    { latestMessage: updatedChat },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate({
      path: "latestMessage",
      populate: [{ path: "sender", select: "name pic email" }],
    });

  if (!chatUpdate) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(chatUpdate);
  }
});

const allMessages = asyncHandler(async (req, res, next) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export { sendMessage, updatedMessage, allMessages };
