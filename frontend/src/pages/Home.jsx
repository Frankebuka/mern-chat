import React, { useEffect, useState } from "react";
import { ChatState } from "../Contest/ChatProvider";
import { MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";
import ChatLoading from "../components/ChatLoading";
import User from "../components/User";
import {
  getReceiverId,
  getSenderId,
  getSenderName,
  getSenderOnlineStatue,
  getSenderPic,
} from "../config/ChatLogics";
import { IoEye } from "react-icons/io5";
import UpdateGroupChatModal from "../miscellaneous/UpdateGroupChatModal";
import UserProfileModal from "../miscellaneous/UserProfileModal";
import Loading from "../components/Loading";
import Message from "../components/Message";
import MessageForm from "../components/MessageForm";
import io from "socket.io-client";
import Lottie from "lottie-react";
import animationData from "../animations/typing.json";
import Tooltip from "../components/Tooltip";

const ENDPOINT = "http://localhost:3000";
var socket, selectedChatCompare;

const Home = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [loggedUser, setLoggedUser] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [img, setImg] = useState("");
  const [messageLoading, setMessageLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [recipientId, setRecipientId] = useState();

  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
    fetchAgain,
    setFetchAgain,
  } = ChatState();

  const fetchMessages = async (e) => {
    if (!selectedChat) return;

    try {
      setMessageLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setMessageLoading(false);

      socket.emit("join chat", selectedChat._id, user);
    } catch (error) {
      setMessageLoading(false);
      toast(`Error fetching messages ${error.message}`, {
        type: "error",
        position: "bottom-left",
      });
    }
  };

  // const object = {
  //   chat: {
  //     _id: "656337d63f765c615ff7d4f4",
  //     chatName: "sender",
  //     isGroupChat: false,
  //     users: [
  //       {
  //         _id: "655b51e79435f04517b71206",
  //         name: "Guest User",
  //         email: "guestuser@gmail.com",
  //         pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  //       },
  //     ],
  //     __v: 0,
  //     createdAt: "2023-11-26T12:19:34.300Z",
  //     latestMessage: {_id: '659edbba254917710b4f6b6d'},
  //     updatedAt: "2024-01-04T18:13:02.041Z",
  //   },
  //   content: "hi",
  //   createdAt: "2024-01-04T17:58:01.068Z",
  //   pic: "",
  //   sender: {
  //     _id: "6550e29a3bb0d1aec2edf85e",
  //     name: "racheal",
  //     pic: "http://res.cloudinary.com/mern-chat-application/image/upload/v1700657243/fwzfwdnfmjsfnkipeyug.jpg",
  //   },
  //   unread: true,
  //   updatedAt: "2024-01-04T17:58:01.068Z",
  //   __v: 0,
  //   _id: "6596f1a9cdbdb0ba4ca8f2f0",
  // };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", (data) => {
      if (data.recipientId === user._id) {
        setRecipientId(data.senderId);
        setIsTyping(true);
      }
    });
    socket.on("stop typing", (data) => {
      if (data.recipientId === user._id) {
        setRecipientId(null);
        setIsTyping(false);
      }
    });
  }, []);

  const fetchNotification = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/notification", config);
      setNotification(data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, [fetchAgain]);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", async (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // if (!notification.includes(newMessageReceived)) {
        //   setNotification([newMessageReceived, ...notification]);
        //   setFetchAgain(!fetchAgain);
        // }
        try {
          const message = {
            ...newMessageReceived,
            receiver: getSenderId(user, newMessageReceived.chat.users),
          };
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
          };
          await axios.post("/api/notification", { message }, config);
          setFetchAgain(!fetchAgain);
        } catch (error) {
          console.error(error.response.data);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  }, []);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Typing Indicator Logic
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", {
        senderId: user._id,
        recipientId: getReceiverId(user, selectedChat?.users),
      });
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", {
          senderId: user._id,
          recipientId: getReceiverId(user, selectedChat?.users),
        });
        setTyping(false);
      }
    }, timerLength);
  };

  const postDetails = (pics) => {
    setDetailsLoading(true);
    if (pics === undefined) {
      toast("Please select an image!", {
        type: "warming",
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chatting-app");
      data.append("cloud_name", "mern-chat-application");
      fetch(
        "https://api.cloudinary.com/v1_1/mern-chat-application/image/upload",
        {
          method: "post",
          body: data,
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setImg(data.url.toString());
          setDetailsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setDetailsLoading(false);
        });
    } else {
      toast("Please select jpeg or png image", {
        type: "warming",
      });
      setDetailsLoading(false);
      return;
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage && !img) {
      toast("Please enter something to send", {
        type: "warning",
        position: "top-left",
      });
      return;
    }

    socket.emit("stop typing", {
      senderId: user._id,
      recipientId: getReceiverId(user, selectedChat?.users),
    });

    try {
      setDetailsLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      setNewMessage("");
      setImg("");

      const { data } = await axios.post(
        "/api/message",
        {
          content: newMessage,
          pic: img,
          chatId: selectedChat._id,
        },
        config
      );

      socket.emit("new message", data);
      setMessages([...messages, data]);
      setDetailsLoading(false);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      setDetailsLoading(false);
      toast(`Error sending message ${error.message}`, {
        type: "error",
        position: "bottom",
      });
    }
  };

  const handleSearch = async (event) => {
    if (event.key === "Enter" && !search) {
      toast("Please enter something in search", {
        type: "warning",
        position: "top-left",
      });
      return;
    }

    if (event.key === "Enter" && search) {
      try {
        setLoading(true);

        const Config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`/api/user?search=${search}`, Config);
        setSearchResult(data);
        setSelectedChat(null);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast(`Error Occurred! ${error.message}`, {
          type: "error",
          position: "bottom-left",
        });
      }
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const Config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, Config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
    } catch (error) {
      setLoadingChat(false);
      toast(`Error fetching chat ${error.message}`, {
        type: "error",
        position: "bottom-left",
      });
    }
  };

  const fetchChats = async () => {
    try {
      const Config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", Config);
      setChats(data);
    } catch (error) {
      toast(`Error! ${error.message}`, {
        type: "error",
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain, selectedChat]);

  const handleChatClick = async (chat) => {
    if (!chat.latestMessage) {
      setSelectedChat(chat);
    } else {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        };
        const { data } = await axios.put(
          "/api/message/update",
          {
            messageId: chat.latestMessage?._id,
            chatId: chat?._id,
          },
          config
        );
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
      } catch (error) {
        toast(`Error! ${error.message}`, {
          type: "error",
          position: "bottom-left",
        });
      }
    }
  };

  return (
    <div className="home_container">
      <div className="users_container" style={{ position: "relative" }}>
        <div className="modal-input">
          <div className="input-wrapper">
            <Tooltip text={"Search user to chat"}>
              <MdSearch className="MdSearch" />
            </Tooltip>

            <input
              type="text"
              placeholder="Search or add new chat"
              className="search"
              onKeyDown={handleSearch}
              onChange={(e) => setSearch(e.target.value)}
              // onClick={handleSearch}
            />
          </div>
        </div>
        {loading ? (
          <ChatLoading />
        ) : (
          searchResult?.map((user) => (
            <User
              key={user._id}
              user={user}
              loggedUser={loggedUser}
              handleFunction={() => accessChat(user._id)}
            />
          ))
        )}
        {loadingChat && <ChatLoading />}
        {!selectedChat && <hr />}

        {chats &&
          chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => handleChatClick(chat)}
              className={`user_wrapper ${
                chat?._id === selectedChat?._id && "selected_user"
              }`}
            >
              <div className="user_info">
                <div className="user_detail">
                  <img
                    src={
                      !chat.isGroupChat
                        ? loggedUser &&
                          chat.users &&
                          getSenderPic(loggedUser, chat.users)
                        : chat.pic ||
                          "https://alppetro.co.id/dist/assets/images/default.jpg"
                    }
                    alt="image"
                    className="avatar"
                  />
                  <h4 className="truncate2">
                    {!chat.isGroupChat
                      ? loggedUser &&
                        chat.users &&
                        getSenderName(loggedUser, chat.users)
                      : chat.chatName}
                  </h4>
                  {chat.latestMessage?.unread &&
                    chat.latestMessage?.sender._id !== user._id && (
                      <small className="unread">New</small>
                    )}
                </div>
                <div
                  className={`user_status ${
                    !chat.isGroupChat
                      ? loggedUser &&
                        chat.users &&
                        getSenderOnlineStatue(loggedUser, chat.users)
                        ? "online"
                        : "offline"
                      : null
                  }`}
                ></div>
              </div>
              <p className="truncate">
                <strong>
                  {chat.latestMessage?.sender._id === user._id && "Me:"}
                </strong>
                {!chat.isGroupChat ? (
                  isTyping &&
                  recipientId === getReceiverId(loggedUser, chat?.users) ? (
                    <small style={{ marginLeft: 5, fontSize: 10 }}>
                      typing...
                    </small>
                  ) : (
                    chat.latestMessage &&
                    (chat.latestMessage.content ||
                      (chat.latestMessage.pic && <>Photo</>))
                  )
                ) : (
                  chat.latestMessage &&
                  (chat.latestMessage.content ||
                    (chat.latestMessage.pic && <>Photo</>))
                )}
              </p>
            </div>
          ))}

        {/* mobile view */}
        {chats &&
          chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className={`sm_container user_details ${
                selectedChat === chat && "selected_user"
              }`}
            >
              <img
                src={
                  !chat.isGroupChat
                    ? loggedUser &&
                      chat.users &&
                      getSenderPic(loggedUser, chat.users)
                    : chat.pic ||
                      "https://alppetro.co.id/dist/assets/images/default.jpg"
                }
                alt="avatar"
                className="avatar sm_screen"
              />
              <p className="chat_name_image sm_screen truncate2">
                {!chat.isGroupChat
                  ? loggedUser &&
                    chat.users &&
                    getSenderName(loggedUser, chat.users)
                  : chat.chatName}
              </p>
            </div>
          ))}
      </div>

      {/* chat page */}
      <div className="messages_container">
        {selectedChat ? (
          <>
            <div
              className="messages_user"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: "32px",
                paddingRight: "32px",
              }}
            >
              <h3>
                {!selectedChat.isGroupChat ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {user &&
                      selectedChat.users &&
                      getSenderName(user, selectedChat.users).toUpperCase()}
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {selectedChat.chatName.toUpperCase()}
                  </div>
                )}
              </h3>
              {!selectedChat.isGroupChat ? (
                <div>
                  <UserProfileModal>
                    <IoEye className="user_wrapper" />
                  </UserProfileModal>
                  <div
                    className={`user_status2 ${
                      !selectedChat.isGroupChat &&
                      loggedUser &&
                      selectedChat.users &&
                      (getSenderOnlineStatue(loggedUser, selectedChat.users)
                        ? "online"
                        : "offline")
                    }`}
                  ></div>
                </div>
              ) : (
                <UpdateGroupChatModal fetchMessages={fetchMessages}>
                  <IoEye />
                </UpdateGroupChatModal>
              )}
            </div>
            <div className="messages">
              {messageLoading ? (
                <Loading />
              ) : (
                messages &&
                messages.map((m) => <Message key={m._id} m={m} user={user} />)
              )}
              {isTyping && (
                <div className="typing">
                  <Lottie
                    animationData={animationData}
                    loop
                    autoplay
                    style={{
                      width: 50,
                      height: 50,
                      marginBottom: 15,
                      marginLeft: 0,
                    }}
                  />
                </div>
              )}
            </div>
            <MessageForm
              sendMessage={sendMessage}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              setImg={setImg}
              postDetails={postDetails}
              detailsLoading={detailsLoading}
              typingHandler={typingHandler}
            />
          </>
        ) : (
          <h3 className="no_conv">
            Select a user or group to start conversation
          </h3>
        )}
      </div>
    </div>
  );
};

export default Home;
