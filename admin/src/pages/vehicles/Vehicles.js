// src/pages/vehicles/Vehicle.js
import React, { useEffect, useState } from "react";
import styles from "./Vehicle.module.scss";
import { FaTrash, FaCar, FaIdCard, FaLock, FaUnlock } from "react-icons/fa";
import Pagination from "../../components/pagination/pagination";
import { getVehicles, deleteVehicle, updateVehicleStatus } from "../../api/vehicleAPI";

const Vehicle = () => {
  const [vehicles, setVehicles] = useState([]);          // tất cả phương tiện
  const [displayVehicles, setDisplayVehicles] = useState([]); // phương tiện trang hiện tại
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // === Lấy tất cả phương tiện ===
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await getVehicles(); // trả về mảng
      setVehicles(data);
      updatePage(data, currentPage);
    } catch (err) {
      alert("Lỗi khi tải danh sách phương tiện: " + err.message);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  // === Cập nhật phương tiện trang hiện tại ===
  const updatePage = (allVehicles, page) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    setDisplayVehicles(allVehicles.slice(start, end));
  };

  // load lần đầu
  useEffect(() => {
    fetchVehicles();
  }, []);

  // khi đổi trang
  useEffect(() => {
    updatePage(vehicles, currentPage);
  }, [currentPage, vehicles]);

  const totalPages = Math.ceil(vehicles.length / pageSize);

  // === Xóa phương tiện ===
  const handleDelete = async (id, plateNumber) => {
    if (!window.confirm(`Bạn có chắc muốn xóa phương tiện ${plateNumber} không?`)) return;

    try {
      await deleteVehicle(id);
      alert("Xóa thành công!");
      const newVehicles = vehicles.filter((v) => v.id !== id);
      setVehicles(newVehicles);
      if (currentPage > Math.ceil(newVehicles.length / pageSize)) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (err) {
      alert("Xóa thất bại: " + err.message);
    }
  };

  // === Khóa / mở khóa phương tiện ===
  const handleToggleStatus = async (id, status, plateNumber) => {
    const isActive = status === "ACTIVE";
    if (!window.confirm(`Bạn có chắc muốn ${isActive ? "dừng" : "mở"} hoạt động phương tiện ${plateNumber} không?`)) return;

    setActionLoading(true);
    try {
      const updated = await updateVehicleStatus(id, !isActive);
      const newVehicles = vehicles.map((v) =>
        v.id === id ? { ...v, status: updated.status } : v
      );
      setVehicles(newVehicles);
      alert(`Phương tiện ${plateNumber} đã chuyển sang trạng thái ${updated.status === "ACTIVE" ? "Hoạt động" : "Dừng hoạt động"} thành công!`);
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
              <th><FaCar /> Biển số</th>
              <th>Loại xe</th>
              <th>Chủ sở hữu</th>
              <th><FaIdCard /> RFID / E-Tag</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {displayVehicles.map((v) => {
              const isActive = v.status === "ACTIVE";
              return (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.plateNumber}</td>
                  <td>{v.vehicleType}</td>
                  <td>{v.fullName}</td>
                  <td>{v.rfidUid}</td>
                  <td>
                    <span className={`${styles.status} ${isActive ? styles.active : styles.stopped}`}>
                      {isActive ? "Hoạt động" : "Dừng hoạt động"}
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(v.id, v.plateNumber)} disabled={actionLoading}>
                      <FaTrash />
                    </button>
                    <button className={styles.lockBtn} onClick={() => handleToggleStatus(v.id, v.status, v.plateNumber)} disabled={actionLoading}>
                      {isActive ? <FaUnlock /> : <FaLock />}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination frontend */}
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
