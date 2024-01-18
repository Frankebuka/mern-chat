import { useEffect, useState } from "react";
import { ChatState } from "../Contest/ChatProvider";
import { toast } from "react-toastify";
import axios from "axios";
import ChatLoading from "./ChatLoading";

const User = ({ user, handleFunction, loggedUser }) => {
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();

  //   const [data, setData] = useState("");

  //   const user2 = user?.id;
  //   const db = getFirestore(app);

  //   useEffect(() => {
  //     const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
  //     let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
  //       setData(doc.data());
  //     });
  //     return () => unsub();
  //   }, []);

  return (
    <>
      <div className="user_wrapper">
        <div
          className={`user_info ${selectedChat && "usersDisplayNone"}`}
          onClick={handleFunction}
        >
          <div className="user_detail">
            <img src={user.pic} alt="image" className="avatar" />
            <div className="user_detail_2">
              <h4 className="truncate2">{user.name}</h4>
              <h5 className="truncate2"> Email: {user.email}</h5>
            </div>
          </div>
        </div>
      </div>

      {/* mobile view */}
      <div
        onClick={handleFunction}
        className={`sm_container user_details ${
          selectedChat && "usersDisplayNone"
        }`}
      >
        <img src={user.pic} alt="avatar" className="avatar sm_screen" />
        <p className="chat_name_image sm_screen truncate2">{user.name}</p>
      </div>
    </>
  );
};

export default User;
