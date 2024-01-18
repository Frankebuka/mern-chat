import React from "react";

const NotFound = () => {
  return (
    <div style={{ position: "relative" }}>
      <h2
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        Page not found
      </h2>
    </div>
  );
};

export default NotFound;
