import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Login from "../pages/Login";
import Guest from "../pages/Guest";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatProvider, { ProtectedRoute } from "../Contest/ChatProvider";
import NotFound from "../pages/NotFound";
import GroupChatModal from "../miscellaneous/GroupChatModal";

const Router = () => {
  return (
    <BrowserRouter>
      <ChatProvider>
        <Navbar />
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/guest" element={<Guest />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
          <Route element={<ProtectedRoute />}>
            <Route exact path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/group-chat-modal" element={<GroupChatModal />} />
          </Route>
        </Routes>
      </ChatProvider>
    </BrowserRouter>
  );
};

export default Router;
