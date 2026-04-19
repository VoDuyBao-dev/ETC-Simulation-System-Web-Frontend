import React, { useEffect, useState } from "react";
import styles from "./Vehicle.module.scss";
import { FaTrash, FaCar, FaIdCard, FaLock, FaUnlock } from "react-icons/fa";
import Pagination from "../../components/pagination/pagination";
import {
  getVehicles,
  deleteVehicle,
  updateVehicleStatus,
} from "../../api/vehicleAPI";

const Vehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const pageSize = 10;

  // === Lấy dữ liệu từ backend pagination ===
  const fetchVehicles = async (page) => {
    setLoading(true);
    try {
      const res = await getVehicles(page - 1, pageSize);

      setVehicles(res.vehicles);
      setTotalPages(res.totalPages);
    } catch (err) {
      alert("Lỗi khi tải danh sách phương tiện: " + err.message);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  // load khi đổi trang
  useEffect(() => {
    fetchVehicles(currentPage);
  }, [currentPage]);

  // === Xóa phương tiện ===
  const handleDelete = async (id, plateNumber) => {
    if (!window.confirm(`Bạn có chắc muốn xóa phương tiện ${plateNumber} không?`))
      return;

    try {
      await deleteVehicle(id);
      alert("Xóa thành công!");

      // gọi lại API cho đúng page
      fetchVehicles();
    } catch (err) {
      alert("Xóa thất bại: " + err.message);
    }
  };

  // === Khóa / mở khóa phương tiện ===
  const handleToggleStatus = async (id, status, plateNumber) => {
    const isActive = status === "ACTIVE";
    const newStatus = isActive ? "INACTIVE" : "ACTIVE";

    if (
      !window.confirm(
        `Bạn có chắc muốn ${
          isActive ? "dừng" : "mở"
        } hoạt động phương tiện ${plateNumber} không?`
      )
    )
      return;

    setActionLoading(true);
    try {
      await updateVehicleStatus(id, !isActive);

      // cập nhật UI nhẹ (không cần gọi API lại)
      const newVehicles = vehicles.map((v) =>
        v.id === id ? { ...v, status: newStatus } : v
      );
      setVehicles(newVehicles);

      alert(
        `Phương tiện ${plateNumber} đã chuyển sang trạng thái ${
          newStatus === "ACTIVE" ? "Hoạt động" : "Dừng hoạt động"
        }`
      );
    } catch (err) {
      alert("Thay đổi trạng thái thất bại: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (!vehicles.length) return <p>Chưa có phương tiện nào.</p>;

  return (
    <div className={styles.vehiclePage}>
      <div className={styles.header}>
        <h2>Quản lý Phương tiện</h2>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>
                <FaCar /> Biển số
              </th>
              <th>Loại xe</th>
              <th>Chủ sở hữu</th>
              <th>
                <FaIdCard /> RFID / E-Tag
              </th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => {
              const isActive = v.status === "ACTIVE";
              return (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.plateNumber}</td>
                  <td>{v.vehicleType}</td>
                  <td>{v.fullName}</td>
                  <td>{v.rfidUid}</td>
                  <td>
                    <span
                      className={`${styles.status} ${
                        isActive ? styles.active : styles.stopped
                      }`}
                    >
                      {isActive ? "Hoạt động" : "Dừng hoạt động"}
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(v.id, v.plateNumber)}
                      disabled={actionLoading}
                    >
                      <FaTrash />
                    </button>
                    <button
                      className={styles.lockBtn}
                      onClick={() =>
                        handleToggleStatus(v.id, v.status, v.plateNumber)
                      }
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

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Vehicle;