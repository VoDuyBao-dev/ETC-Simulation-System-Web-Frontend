import { useState } from "react";
import styles from "./Header.module.scss";
import { FaEnvelope } from "react-icons/fa";
import Notification from "./headerComp/notification/Notification";

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
  };

  return (
    <header className={styles.mainHeader}>

      {/* === Phần bên phải (mail + avatar + dropdown) === */}
      <div className={styles.headerRight}>
        {/* Icon thư có badge */}
        <div className={styles.mailIcon} onClick={toggleNotifications}>
          <FaEnvelope />
          <span className={styles.badge}>6</span>
          {showNotifications && <Notification />}
        </div>

        {/* Menu người dùng (avatar + tên + dropdown) */}
        <div className={styles.userMenu}>
          {/* === Avatar thật (giống sidebar) === */}
          <img
            src="https://i.pravatar.cc/50"
            alt="User Avatar"
            className={styles.avatarImg}
          />
          <span className={styles.username}>John Doe</span>

          {/* Dropdown menu */}
          <div className={styles.dropdown} onClick={toggleUserMenu}>
            <ul> 
              <li>Đăng xuất</li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
