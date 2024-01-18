import React from "react";
import { IoMdClose } from "react-icons/io";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <div
      onClick={handleFunction}
      style={{
        padding: "8px 16px",
        borderRadius: "12px",
        margin: "4px",
        marginBottom: "8px",
        backgroundColor: "purple",
        fontSize: "12px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "fit-content",
      }}
    >
      {user.name}
      <IoMdClose style={{ paddingLeft: "12px", fontSize: "20px" }} />
    </div>
  );
};

export default UserBadgeItem;
