import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ChatState } from "../Contest/ChatProvider";
import axios from "axios";
import ChatLoading from "../components/ChatLoading";
import UserListItem from "../components/UserAvatar/UserListItem";
import UserBadgeItem from "../components/UserAvatar/UserBadgeItem";
import Camera from "../assets/svg/Camera";
import Delete from "../assets/svg/Delete";
import { IoMdClose } from "react-icons/io";

function UpdateGroupChatModal({ children, fetchMessages }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  const [img, setImg] = useState();
  const [pic, setPic] = useState();

  const { user, selectedChat, setSelectedChat, fetchAgain, setFetchAgain } =
    ChatState();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const defaultPic = "https://alppetro.co.id/dist/assets/images/default.jpg";

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

  const handleRename = async () => {
    if (!groupChatName) {
      toast("Please fill the input", {
        type: "warning",
        position: "top",
      });
      return;
    }

    try {
      setRenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/rename",
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      setRenameLoading(false);
      toast("Failed to rename the chat", {
        type: "error",
        position: "bottom",
      });
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast(
        `Only admin (${selectedChat.groupAdmin.name}) can remove someone!`,
        {
          type: "error",
          position: "bottom",
        }
      );
      return;
    }

    const confirm = window.confirm(
      `Are you sure you want to remove ${user1.name} from the group?`
    );

    if (!confirm) {
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/groupremove",
        { chatId: selectedChat._id, userId: user1._id },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast("Failed to remove the user", {
        type: "error",
        position: "bottom",
      });
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.includes(user1)) {
      toast("User already in the group", {
        type: "error",
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast("Only admins can add someone", {
        type: "error",
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/groupadd",
        { chatId: selectedChat._id, userId: user1._id },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast("Failed to add the user", {
        type: "error",
        position: "bottom",
      });
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
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
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast("Please select an image with jpeg or png", {
        type: "warming",
      });
      setPicLoading(false);
      return;
    }
  };

  useEffect(() => {
    if (img || pic) {
      const UploadImg = async () => {
        try {
          setPicLoading(true);

          const config = {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          };

          const { data } = await axios.put(
            "/api/chat/changepic",
            { chatId: selectedChat._id, pic: img || pic },
            config
          );

          setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          setPicLoading(false);
          setImg("");
          setPic("");
          img
            ? toast("Profile picture updated", { type: "success" })
            : toast("Profile picture deleted successful", { type: "success" });
        } catch (err) {
          console.log(err.message);
          setPicLoading(false);
        }
      };
      UploadImg();
    }
  }, [img, pic]);

  const deleteImage = () => {
    setPic(defaultPic);
  };

  return (
    <div>
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
              <h2 className="modal-title">{selectedChat.chatName}</h2>
              <div className="img_container">
                <img src={selectedChat.pic || defaultPic} alt="" />
                <div className="overlay">
                  <label htmlFor="photo">
                    <Camera />
                  </label>
                  {selectedChat.pic !== defaultPic && (
                    <Delete deleteImage={deleteImage} />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    id="photo"
                    onChange={(e) => postDetails(e.target.files[0])}
                  />
                </div>
              </div>

              <div className="modal-input">
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Chat Name"
                    className="input-field"
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                  <button
                    className="inside-button"
                    disabled={renameLoading}
                    onClick={handleRename}
                  >
                    {renameLoading ? "Updating in ..." : "Update"}
                  </button>
                </div>
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
                {selectedChat.users?.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleRemove(u)}
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
                        handleFunction={() => handleAddUser(user)}
                      />
                    ))
                )}
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => handleRemove(user)}
                  className="submit-button"
                >
                  Leave Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateGroupChatModal;
