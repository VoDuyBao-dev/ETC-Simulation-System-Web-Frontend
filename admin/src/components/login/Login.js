import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";
import { FaUser, FaLock } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [showNew, setShowNew] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: false,
  });

  // Cập nhật dữ liệu form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Xử lý đăng nhập
  const handleLogin = (e) => {
    e.preventDefault();

    // Kiểm tra đơn giản (vì form tĩnh)
    if (form.username.trim() === "" || form.password.trim() === "") {
      alert("Vui lòng nhập đầy đủ thông tin đăng nhập!");
      return;
    }

    // Nếu có "remember", lưu thông tin vào localStorage
    if (form.remember) {
      localStorage.setItem("rememberUser", form.username);
    } else {
      localStorage.removeItem("rememberUser");
    }

    // Điều hướng về trang chủ
    navigate("/");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Đăng nhập Admin</h1>

        <form onSubmit={handleLogin}>
          <div className="input-box">
            <FaUser className="icon" />
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Tên đăng nhập"
              required
            />
          </div>

          <div className="input-box password-box">
            <FaLock className="icon" />
            <input
              type={showNew ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mật khẩu"
              required
            />
            <span className="eye-icon" onClick={() => setShowNew(!showNew)}>
              {showNew ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="options">
            <label>
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />{" "}
              Ghi nhớ đăng nhập
            </label>
          </div>

          <button type="submit" className="btn-login">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
