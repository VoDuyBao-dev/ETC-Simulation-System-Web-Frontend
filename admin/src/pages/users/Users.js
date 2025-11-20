// src/pages/users/Users.js
import React, { useState, useEffect, useCallback } from "react";
import styles from "./Users.module.scss";
import { FaLock, FaUnlock } from "react-icons/fa";
import Pagination from "../../components/pagination/pagination";
import { getUsers, updateUserStatus } from "../../api/userAPI";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  // --- Fetch users ---
  const fetchUsers = useCallback(async (page) => {
    setLoading(true);
    try {
      const data = await getUsers(page - 1, pageSize); // backend 0-based page
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      alert("Lỗi khi tải người dùng: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [fetchUsers, currentPage]);

  // --- Toggle Active/Inactive ---
  const handleToggleActive = async (userId, isActive) => {
    if (!window.confirm(`Bạn có chắc muốn ${isActive ? "khóa" : "mở khóa"} người dùng này?`)) return;

    setActionLoading(true);
    try {
      const updatedUser = await updateUserStatus(userId, isActive ? "BLOCKED" : "ACTIVE");
      setUsers(users.map(u => u.userId === userId ? { ...u, status: updatedUser.status } : u));
      alert(`Người dùng đã được ${isActive ? "khóa" : "mở khóa"} thành công!`);
    } catch (err) {
      alert("Cập nhật thất bại: " + err.message);
    } finally {
      setActionLoading(false);
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
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th></th>
                  <th>Họ và tên</th>
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
                    <tr key={u.userId}>
                      <td>{index + 1 + (currentPage - 1) * pageSize}</td>
                      <td>{u.fullname}</td>
                      <td>{u.email}</td>
                      <td>{u.roles[0]}</td>
                      <td>
                        <span className={`${styles.status} ${u.status === "ACTIVE" ? styles.active : styles.inactive}`}>
                          {u.status === "ACTIVE" ? "Hoạt động" : "Đã khóa"}
                        </span>
                      </td>
                      <td className={styles.actions}>
                        <button
                          className={styles.lockBtn}
                          onClick={() => handleToggleActive(u.userId, u.status === "ACTIVE")}
                          disabled={actionLoading}
                        >
                          {u.status === "ACTIVE" ? <FaUnlock /> : <FaLock />}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default Users;
