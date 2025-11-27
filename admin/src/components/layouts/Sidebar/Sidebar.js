import React, { useState, useEffect} from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.scss";
import avatarImg from "../../../assets/imgs/image.jpg";
import {
  FaHome,
  FaUsers,
  FaCar,
  FaMapMarkedAlt,
  FaMoneyBill,
} from "react-icons/fa";

const Sidebar = () => {
  const menuItems = [
    { title: "Trang chủ", path: "/", icon: <FaHome /> },
    { title: "Người dùng", path: "/users", icon: <FaUsers /> },
    { title: "Phương tiện", path: "/vehicles", icon: <FaCar /> },
    { title: "Trạm thu phí", path: "/tollstations", icon: <FaMapMarkedAlt /> },
    { title: "Giao dịch thu phí", path: "/transactions", icon: <FaMoneyBill /> },
  ];
    const [username, setUsername] = useState("Admin");
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setUsername(payload.username || "Admin");
        } catch {
          setUsername("Admin");
        }
      }
    }, []);

  return (
    <aside className={styles.sidebar}>
      {/* ===== Header ===== */}
      <div className={styles.header}>
        <h2>Dashboard</h2>
      </div>

      {/* ===== Profile ===== */}
      <div className={styles.profile}>
        <img
          src={avatarImg}
          alt="User Avatar"
          className={styles.avatar}
        />
        <div className={styles.userInfo}>
          <span>Welcome,</span>
          <h4>{username}</h4>
        </div>
      </div>

      {/* ===== Menu ===== */}
      <nav className={styles.menu}>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? `${styles.active}` : ""
                }
              >
                {item.icon}
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
