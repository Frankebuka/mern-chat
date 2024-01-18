import React from "react";
import Attachment from "../assets/svg/Attachment";

const MessageForm = ({
  sendMessage,
  newMessage,
  postDetails,
  detailsLoading,
  typingHandler,
}) => {
  return (
    <form className="message_form" onSubmit={sendMessage}>
      <label htmlFor="img">
        <Attachment />
      </label>
      <input
        onChange={(e) => postDetails(e.target.files[0])}
        type="file"
        id="img"
        accept="image/*"
        style={{ display: "none" }}
      />
      <div>
        <input
          type="text"
          placeholder="Enter message"
          value={newMessage}
          // onChange={(e) => setNewMessage(e.target.value)}
          onChange={typingHandler}
        />
      </div>
      <div>
        <button className="btn" disabled={detailsLoading}>
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageForm;
