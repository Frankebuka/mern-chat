import React, { useState } from "react";
import { toast } from "react-toastify";
import { ChatState } from "../Contest/ChatProvider";
import axios from "axios";
import ChatLoading from "../components/ChatLoading";
import User from "../components/User";
import UserListItem from "../components/UserAvatar/UserListItem";
import UserBadgeItem from "../components/UserAvatar/UserBadgeItem";
import { IoMdClose } from "react-icons/io";
import Tooltip from "../components/Tooltip";

function GroupChatModal({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast(`Error Occurred! ${error.message}`, {
        type: "error",
        position: "bottom-left",
      });
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      toast("Please fill all the fields", {
        type: "warning",
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      toggleModal();
      toast("New group chat created!", {
        type: "success",
        position: "bottom",
      });
    } catch (error) {
      toast("Failed to create the chat", {
        type: "error",
        position: "bottom",
      });
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast("User already added", {
        type: "warning",
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  return (
    <Tooltip text={"Click to start a group chat"}>
      <span onClick={toggleModal} className="open-modal-button">
        {children}
      </span>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-background"></div>
            <span className="modal-placeholder"></span>
            <div className="modal-box">
              <div className="button-wrapper">
                <IoMdClose className="close-button" onClick={toggleModal} />
              </div>
              <h2 className="modal-title">Create Group Chat</h2>
              <div className="modal-input">
                <input
                  type="text"
                  placeholder="Chat Name"
                  className="input-field"
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </div>
              <div className="modal-input2">
                <input
                  type="text"
                  placeholder="Add Users eg: John, Frank, Jane"
                  className="input-field"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  padding: "8px 16px",
                }}
              >
                {selectedUsers?.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginRight: "34px",
                  gap: "8px",
                }}
              >
                {loading ? (
                  <ChatLoading />
                ) : (
                  searchResult
                    ?.slice(0, 3)
                    .map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handleGroup(user)}
                      />
                    ))
                )}
              </div>
              <div className="modal-footer">
                <button onClick={handleSubmit} className="submit-button">
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Tooltip>
  );
}

export default GroupChatModal;
