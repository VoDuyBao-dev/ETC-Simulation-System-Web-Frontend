import { useState, useEffect, useRef } from "react";
import styles from "./Dropdown.module.scss"

const Dropdown = ({ username, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setShowMenu(prev => !prev);

  // Click ngoài đóng menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className={styles.userMenu} ref={menuRef}>
      <img
        src="https://i.pravatar.cc/50"
        alt="User Avatar"
        className={styles.avatarImg}
        onClick={toggleMenu}
      />
      <span className={styles.username} onClick={toggleMenu}>{username}</span>
    
      {showMenu  && (
        <div className={styles.dropdown}>
            <ul>
            <li onClick={onLogout}>Đăng xuất</li>
            </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
