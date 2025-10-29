import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.scss";
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

  return (
    <aside className={styles.sidebar}>
      {/* ===== Header ===== */}
      <div className={styles.header}>
        <h2>Dashboard</h2>
      </div>

      {/* ===== Profile ===== */}
      <div className={styles.profile}>
        <img
          src="https://i.pravatar.cc/50"
          alt="User Avatar"
          className={styles.avatar}
        />
        <div className={styles.userInfo}>
          <span>Welcome,</span>
          <h4>John Doe</h4>
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
