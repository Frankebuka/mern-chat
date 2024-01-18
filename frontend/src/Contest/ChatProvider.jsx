import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, Outlet } from "react-router-dom";
import Loading from "../components/Loading";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [guestUser, setGuestUser] = useState(false);
  const [notification, setNotification] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    setLoading(false);
    guestUser && navigate("/guest", { replace: true });
  }, [navigate, guestUser]);

  loading && <Loading />;

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        guestUser,
        setGuestUser,
        notification,
        setNotification,
        fetchAgain,
        setFetchAgain,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export const ProtectedRoute = () => {
  const { user } = ChatState();

  return user ? <Outlet /> : <Navigate to="/login" replace={true} />;
};

export default ChatProvider;
