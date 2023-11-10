import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

const Home = () => {
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    const { data } = await axios.get("/api/chat");
    // const res = await fetch("/api/chat");
    // const data = await res.json();
    console.log(data);
    setChats(data);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div>{chats && chats.map((d) => <div key={d._id}>{d.chatName}</div>)}</div>
  );
};

export default Home;
