import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from "../../api/loginAPI";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", remember: false });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) return alert("Nhập đầy đủ thông tin!");

    try {
      const data = await login(form.username, form.password);

      // Lưu token và user vào localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      // Nếu chọn remember
      if (form.remember) localStorage.setItem("rememberUser", form.username);

      // Redirect dashboard
      navigate("/");

    } catch (err) {
      // Hiện message backend trả về
      alert(err.message);
    }
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
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mật khẩu"
              required
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="options">
            <label>
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              Ghi nhớ đăng nhập
            </label>
          </div>
          <button type="submit" className="btn-login">Đăng nhập</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
