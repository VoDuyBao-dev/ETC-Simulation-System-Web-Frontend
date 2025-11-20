import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import { FaEnvelope } from "react-icons/fa";
import Notification from "./headerComp/notification/Notification";
import Dropdown from "./headerComp/Dropdown/Dropdown";
import { logout } from "../../../api/logoutAPI";

const Header = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
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

  const toggleNotifications = () => setShowNotifications(prev => !prev);

const handleLogout = async () => {
  const token = localStorage.getItem("token");
  try {
    const data = await logout(token);
    alert(data.message || "Đã logout thành công");
    navigate("/login");
  } catch (err) {
    alert(err.message || "Logout thất bại");
    navigate("/login"); // vẫn chuyển về login
  }
};



  return (
    <header className={styles.mainHeader}>
      <div className={styles.headerRight}>
        <div className={styles.mailIcon} onClick={toggleNotifications}>
          <FaEnvelope />
          <span className={styles.badge}>6</span>
          {showNotifications && <Notification />}
        </div>

        <Dropdown username={username} onLogout={handleLogout} />
      </div>
    </header>
  );
};

export default Header;
