import React, { useContext } from "react";
import { Link } from "react-router-dom";
// import app from "../firebase/Config";
// import { getAuth, signOut } from "firebase/auth";
// import { doc, updateDoc, getFirestore } from "firebase/firestore";
// import { AuthContext } from "../reactContext/Context";
import { useNavigate } from "react-router-dom";
// import newlogo from "../image/newlogo.jpeg";

const Navbar = () => {
  // const { user } = useContext(AuthContext);
  // const auth = getAuth(app);
  // const db = getFirestore(app);
  const navigate = useNavigate();

  const handleSignout = async () => {
    // await updateDoc(doc(db, "users", auth.currentUser.uid), {
    //   isOnline: false,
    // });
    // await signOut(auth);
    // navigate("/login", { replace: true });
  };

  const user = null;

  return (
    <nav>
      <div>
        {!user ? (
          <h3>
            <Link to="/">Chat</Link>
            Group Chat
          </h3>
        ) : (
          <h1 className="logo">Smiles</h1>
        )}
      </div>
      <div>
        {!user ? (
          <>
            <Link to="/profile">Profile</Link>
            <button className="btn" onClick={handleSignout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
