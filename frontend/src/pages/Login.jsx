import React, { useState } from "react";
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// import app from "../firebase/Config";
// import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
  });

  const navigate = useNavigate();

  const { email, password, error, loading } = data;
  // const auth = getAuth(app);
  // const db = getFirestore(app);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (!email || !password) {
      setData({ ...data, error: "All fields are required" });
    }

    // try {
    //   const result = await signInWithEmailAndPassword(auth, email, password);
    //   await updateDoc(doc(db, "users", result.user.uid), {
    //     isOnline: true,
    //   });
    //   setData({
    //     email: "",
    //     password: "",
    //     error: null,
    //     loading: false,
    //   });
    //   navigate("/", { replace: true });
    //   // ...
    // } catch (err) {
    //   const errorCode = err.code;
    //   const errorMessage = err.message;
    //   setData({ ...data, error: err.message, loading: false });
    //   // ..
    // }
  };

  return (
    <div className="background_container_login">
      <section>
        <h3>Log into your account</h3>
        <form className="form" onSubmit={handleSubmit}>
          <div className="input_container">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
            />
          </div>
          <div className="input_container">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
            />
          </div>
          {error ? <p className="error">{error}</p> : null}
          <div className="btn_container">
            <button className="btn" disabled={loading} onClick={handleSubmit}>
              {loading ? "Logging in ..." : "Login"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Login;
