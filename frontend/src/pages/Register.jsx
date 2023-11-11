import React, { useState } from "react";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import app from "../firebase/Config";
// import {
//   setDoc,
//   doc,
//   getFirestore,
//   Timestamp,
//   collection,
//   addDoc,
// } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    loading: false,
  });

  const navigate = useNavigate();

  const { name, email, password, error, loading } = data;
  // const auth = getAuth(app);
  // const db = getFirestore(app);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (!name || !email || !password) {
      setData({ ...data, error: "All fields are required" });
    }
    // try {
    //   const result = await createUserWithEmailAndPassword(
    //     auth,
    //     email,
    //     password
    //   );
    //   await setDoc(doc(db, "users", result.user.uid), {
    //     id: result.user.uid,
    //     name,
    //     email,
    //     createdAt: Timestamp.fromDate(new Date()),
    //     isOnline: true,
    //   });
    //   setData({
    //     name: "",
    //     email: "",
    //     password: "",
    //     error: null,
    //     loading: false,
    //   });
    //   navigate("/", { replace: true });
    //   //       // ...
    // } catch (error) {
    //   setData({ ...data, error: error.message, loading: false });
    //   const errorCode = error.code;
    //   const errorMessage = error.message;
    //   console.error("Error adding document: ", e);
    //   // ..
    // }
  };

  return (
    <div className="background_container">
      <section>
        <h3 id="black">Create An Account</h3>
        <form className="form" onSubmit={handleSubmit}>
          <div className="input_container">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              minLength="1"
              maxLength="17"
              name="name"
              value={name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input_container">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input_container">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              required
            />
          </div>
          {error ? <p className="error">{error}</p> : null}
          <div className="btn_container">
            <button className="btn" disabled={loading} onClick={handleSubmit}>
              {loading ? "Creating ..." : "Register"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Register;
