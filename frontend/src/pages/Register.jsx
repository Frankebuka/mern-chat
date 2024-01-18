import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [datas, setDatas] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    loading: false,
  });

  const navigate = useNavigate();

  const { name, email, password, error, loading } = datas;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setDatas({ ...datas, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDatas({ ...datas, error: null, loading: true });

    if (!name || !email || !password) {
      setDatas({ ...datas, loading: false, error: "All fields are required" });
      toast.warning("All fields are required");
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        { name, email, password },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(data));

      setDatas({
        name: "",
        email: "",
        password: "",
        error: null,
        loading: false,
      });

      toast("Registration successful", {
        type: "success",
      });

      navigate("/", { replace: true });
    } catch (error) {
      setDatas({
        ...datas,
        error: error.response.data.message,
        loading: false,
      });
      toast("Registration failed", { type: "error" });
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error registering: ", error);
      console.log(errorCode, errorMessage);
    }
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
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
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
