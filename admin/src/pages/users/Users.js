import React, { useState, useEffect } from "react";
import styles from "./Users.module.scss";
import { FaLock, FaUnlock } from "react-icons/fa";
import Pagination from "../../components/pagination/pagination";
import { getUsers, updateUserStatus } from "../../api/userAPI";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [displayUsers, setDisplayUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await getUsers();
      setUsers(allUsers);
      updatePage(allUsers, currentPage);
    } catch (err) {
      alert("Lỗi khi tải người dùng: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePage = (allUsers, page) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    setDisplayUsers(allUsers.slice(start, end));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    updatePage(users, currentPage);
  }, [currentPage, users]);

  const totalPages = Math.ceil(users.length / pageSize);

  const handleToggleActive = async (userId, isActive) => {
    if (!window.confirm(`Bạn có chắc muốn ${isActive ? "khóa" : "mở khóa"} người dùng này?`)) return;

    setActionLoading(true);
    try {
      const updatedUser = await updateUserStatus(userId, isActive ? "BLOCKED" : "ACTIVE");

      // cập nhật ngay trong frontend
      setUsers((prev) =>
        prev.map((u) =>
          u.userId === userId ? { ...u, status: updatedUser.status } : u
        )
      );

    } catch (err) {
      alert("Cập nhật thất bại: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (!users.length) return <p>Không có người dùng</p>;

  return (
    <div className={styles.container}>
      <h2>Quản lý Người dùng</h2>

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
          {displayUsers.map((u, index) => {
            const isActive = u.status === "ACTIVE";
            return (
              <tr key={u.userId}>
                <td>{(currentPage - 1) * pageSize + index + 1}</td>
                <td>{u.fullname}</td>
                <td>{u.email}</td>
                <td>{u.roles?.join(", ")}</td>
                <td>
                  <span className={`${styles.status} ${isActive ? styles.active : styles.inactive}`}>
                    {isActive ? "Hoạt động" : "Đã khóa"}
                  </span>
                </td>
                <td>
                  <button
                    className={styles.lockBtn}
                    onClick={() => handleToggleActive(u.userId, isActive)}
                    disabled={actionLoading}
                  >
                    {isActive ? <FaUnlock /> : <FaLock />}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Users;
