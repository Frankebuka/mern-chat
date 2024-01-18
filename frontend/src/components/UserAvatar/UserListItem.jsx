import React, { useState } from "react";

const UserListItem = ({ user, handleFunction }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={handleFunction}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        cursor: "pointer",
        width: "100%",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        marginBottom: "8px",
        padding: "1px 24px",
        margin: "1px 16px",
        backgroundColor: hover ? "#38B2AC" : "#E8E8E8",
        color: hover ? "white" : "black",
        // backgroundColor: "#E8E8E8",
        // color: "black",
        // ":hover": { backgroundColor: "#38B2AC", color: "white" },
      }}
    >
      <img
        src={user.pic}
        alt="image"
        style={{
          cursor: "pointer",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          objectFit: "cover",
          marginRight: "10px",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
        }}
      >
        <p
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            marginBottom: "1px",
          }}
        >
          {user?.name}
        </p>
        <p style={{ fontSize: "12px", marginTop: "1px" }}>
          Email: {user?.email}
        </p>
      </div>
    </div>
  );
};

export default UserListItem;
