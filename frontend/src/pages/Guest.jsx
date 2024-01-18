import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import axios from "axios";
import { ChatState } from "../Contest/ChatProvider";

const Guest = () => {
  const { setGuestUser } = ChatState();
  const [showPassword, setShowPassword] = useState(false);
  const [datas, setDatas] = useState({
    email: "guestuser@gmail.com",
    password: "123456",
    error: "",
    loading: false,
  });

  const navigate = useNavigate();

  const { email, password, error, loading } = datas;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setDatas({ ...datas, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchData = async () => {
      setGuestUser(false);
      setDatas({ ...datas, error: null, loading: true });
      if (!email || !password) {
        setDatas({
          ...datas,
          loading: false,
          error: "All fields are required",
        });
        toast.warning("All fields are required");
      }

      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };

        const { data } = await axios.post(
          "/api/user/login",
          { email, password },
          config
        );

        setDatas({
          email: "",
          password: "",
          error: null,
          loading: false,
        });

        localStorage.setItem("userInfo", JSON.stringify(data));

        toast("Login successful", {
          type: "success",
        });

        navigate("/", { replace: true });
      } catch (error) {
        toast("Login failed", { type: "error" });
        setDatas({
          ...datas,
          error: error.response.data.message,
          loading: false,
        });
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error signing in: ", error);
        console.log(errorCode, errorMessage);
      }
    };

    fetchData();
  }, [email, password]);

  return (
    <div className="background_container_login">
      <section>
        <h3>Log into your account</h3>
        <form className="form">
          <div className="input_container">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              // value={email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input_container">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              // value={password}
              onChange={handleChange}
              required
            />
            {showPassword ? (
              <AiFillEyeInvisible
                className="show_password"
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            ) : (
              <AiFillEye
                className="show_password"
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            )}
          </div>
          {error ? <p className="error">{error}</p> : null}
          <div className="btn_container">
            <button
              className="btn"
              disabled={loading}
              onClick={() => {
                setDatas({
                  ...datas,
                  email: "guestuser@gmail.com",
                  password: "123456",
                });
              }}
            >
              {loading ? "Logging in ..." : "Guest"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Guest;
