import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { ChatState } from "../Contest/ChatProvider";
import { toast } from "react-toastify";
import axios from "axios";
import GroupChatModal from "../miscellaneous/GroupChatModal";
import { useState } from "react";
import { getSenderName } from "../config/ChatLogics";
import { TiMessages, TiMessage } from "react-icons/ti";
// import { TiMessage } from "react-icons/ti";
import moment from "moment";

const Navbar = () => {
  const [openNotification, setOpenNotification] = useState(false);
  const {
    user,
    setGuestUser,
    notification,
    setNotification,
    setSelectedChat,
    fetchAgain,
    setFetchAgain,
  } = ChatState();
  const userId = user?._id;
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.post("/api/user/logout", { userId }, config);

      localStorage.removeItem("userInfo");

      toast("Logout successful", {
        type: "success",
      });
      navigate("/login", { replace: true });
    } catch (error) {
      toast(`Error! ${error.message}`, {
        type: "error",
      });
    }
  };

  const removeSelectedChat = async (notif) => {
    console.log(notif);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      await axios.delete(`/api/notification/${notif._id}`, config);
      setNotification(notification.filter((n) => n._id !== notif._id));

      const { data } = await axios.put(
        "/api/message/update",
        {
          messageId: notif.chat.latestMessage?._id,
          chatId: notif.chat?._id,
        },
        config
      );

      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast(`Error! ${error.message}`, {
        type: "error",
      });
    }
  };

  return (
    <nav>
      <div>
        {user ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <h3>
              <Link to="/">Chat</Link>
            </h3>
            <GroupChatModal>
              <h3>New Group Chat</h3>
              <IoMdAdd
                style={{
                  paddingLeft: "2px",
                  fontSize: "20px",
                }}
              />
            </GroupChatModal>
          </div>
        ) : (
          <h1 className="logo">Smiles</h1>
        )}
      </div>
      <div>
        {user ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div className="notification-wrapper">
              {openNotification && (
                <>
                  <div
                    className="backdrop"
                    onClick={() => setOpenNotification(false)}
                  ></div>
                  <div className="notification-card">
                    {!notification.length && "No New Messages"}
                    {notification &&
                      notification
                        .slice()
                        .reverse()
                        .map((notif) => (
                          <div
                            style={{ cursor: "pointer" }}
                            key={notif._id}
                            onClick={() => {
                              setSelectedChat(notif.chat);
                              removeSelectedChat(notif);
                              setOpenNotification(false);
                            }}
                          >
                            {notif.chat.isGroupChat ? (
                              <div className="message-card">
                                <div className="message-icon">
                                  <TiMessages />
                                </div>
                                <div>
                                  <div className="sender-name">
                                    {notif.chat.chatName}
                                  </div>
                                  <div className="notif-wrapper">
                                    <small className="notif-message">
                                      {notif.content}
                                    </small>
                                    <small className="notif-date">
                                      {moment(notif.createdAt).fromNow()}
                                    </small>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="message-card">
                                <div className="message-icon">
                                  <TiMessage />
                                </div>
                                <div>
                                  <div className="sender-name">
                                    {getSenderName(user, notif.chat.users)}
                                  </div>
                                  <div className="notif-wrapper">
                                    <small className="notif-message">
                                      {notif.content}
                                    </small>
                                    <small className="notif-date">
                                      {moment(notif.createdAt).fromNow()}
                                    </small>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                  </div>
                </>
              )}
              <FaBell
                className="notification-icon"
                onClick={() => {
                  setOpenNotification((prevState) => !prevState);
                  setFetchAgain(!fetchAgain);
                }}
              />
              {notification && notification.length > 0 && (
                <span
                  className="notification-badge"
                  onClick={() => setOpenNotification((prevState) => !prevState)}
                >
                  {notification.length}
                </span>
              )}
            </div>
            <Link to="/profile">Profile</Link>
            <button className="btn" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <div>
            <button
              className="btn"
              style={{ marginRight: "10px" }}
              type="button"
              onClick={() => setGuestUser(true)}
            >
              Guest
            </button>
            <button
              className="btn"
              style={{ marginRight: "10px" }}
              type="button"
            >
              <Link to="/register">Register</Link>
            </button>
            <button className="btn" type="button">
              <Link to="/login">Login</Link>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
