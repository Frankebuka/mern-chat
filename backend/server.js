import express from "express";
import dotenv from "dotenv";
import { chats } from "./data/data.js";

dotenv.config();
const app = express();

app.get("/api/chat", (req, res) => {
  res.send(chats);
});

app.get("/api/chat/:id", (req, res) => {
  // console.log(req.params.id);
  const chat = chats.find((c) => c._id === req.params.id);
  res.send(chat);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
