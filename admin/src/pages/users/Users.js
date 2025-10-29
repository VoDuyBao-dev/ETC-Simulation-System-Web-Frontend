import React, { useState } from "react";
import styles from "./Users.module.scss";
import { FaTrash, FaLock, FaUnlock } from "react-icons/fa";

const User = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", active: true },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Khách hàng", active: true },
    { id: 3, name: "Mark Lee", email: "mark@example.com", role: "Khách hàng", active: false },
  ]);

  // Xóa người dùng
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
    // Thêm alert
    const user = users.find((u) => u.id === id);
    alert(`Người dùng ${user.name} đã được xóa thành công!`);
  };

  // Khóa / mở khóa
  const handleToggleActive = (id) => {
    if (window.confirm("Bạn có chắc muốn thay đổi trạng thái người dùng này?")) {
      setUsers(users.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));
    }
    // thêm alert
    const user = users.find((u) => u.id === id);
    alert(`Người dùng ${user.name} đã ${user.active ? "khóa" : "mở khóa"} thành công!`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Quản lý Người dùng</h2>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Quyền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={u.id}>
                <td>{index + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <span
                    className={`${styles.status} ${
                      u.active ? styles.active : styles.inactive
                    }`}
                  >
                    {u.active ? "Hoạt động" : "Đã khóa"}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(u.id)}
                  >
                    <FaTrash />
                  </button>
                  <button
                    className={styles.lockBtn}
                    onClick={() => handleToggleActive(u.id)}
                  >
                    {u.active ? <FaUnlock /> : <FaLock />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;
