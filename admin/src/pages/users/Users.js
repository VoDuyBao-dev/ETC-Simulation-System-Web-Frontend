import React, { useEffect, useState, useCallback } from "react";
import styles from "./Users.module.scss";
import { FaTrash, FaLock, FaUnlock } from "react-icons/fa";
import Pagination from "../../components/pagination/pagination";
import { getUsers, deleteUser, toggleUserActive } from "../../api/userAPI";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      alert("Lỗi khi tải người dùng: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
      alert("Xóa người dùng thành công!");
    } catch (err) {
      alert("Xóa thất bại: " + err.message);
    }
  };

  const handleToggleActive = async (id, active) => {
    if (!window.confirm("Bạn có chắc muốn thay đổi trạng thái người dùng này?")) return;
    try {
      await toggleUserActive(id, !active);
      setUsers(users.map((u) => (u.id === id ? { ...u, active: !active } : u)));
      alert(`Người dùng đã được ${active ? "mở khóa" : "khóa"} thành công!`);
    } catch (err) {
      alert("Cập nhật thất bại: " + err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Quản lý Người dùng</h2>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th></th>
                <th>Tên</th>
                <th>Email</th>
                <th>Quyền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: 20 }}>
                    Không có người dùng
                  </td>
                </tr>
              ) : (
                users.map((u, index) => (
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
                        onClick={() => handleToggleActive(u.id, u.active)}
                      >
                        {u.active ? <FaUnlock /> : <FaLock />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination />
    </div>
  );
};

export default User;
