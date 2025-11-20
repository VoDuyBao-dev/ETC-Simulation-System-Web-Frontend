import React, { useEffect, useState } from "react";
import styles from "./Vehicle.module.scss";
import { FaTrash, FaCar, FaIdCard, FaLock, FaUnlock } from "react-icons/fa";
import Pagination from "../../components/pagination/pagination";
import { getVehicles, deleteVehicle, updateVehicleStatus } from "../../api/vehicleAPI";

const Vehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [page, setPage] = useState(0); // 1-based page
  const [size] = useState(5);          // items per page
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // === Lấy danh sách phương tiện theo trang ===
  const fetchVehicles = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const data = await getVehicles(pageNumber, size);
      setVehicles(data.content);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      alert("Lỗi khi tải danh sách phương tiện: " + err.message);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles(page);
  }, [page]);

  // === Xóa phương tiện ===
  const handleDelete = async (id, plateNumber) => {
    if (!window.confirm(`Bạn có chắc muốn xóa phương tiện ${plateNumber} không?`)) return;

    try {
      await deleteVehicle(id);
      alert("Xóa thành công!");
      fetchVehicles(page);
    } catch (err) {
      alert("Xóa thất bại: " + err.message);
    }
  };

  // === Khóa / mở khóa phương tiện ===
  const handleToggleStatus = async (id, status, plateNumber) => {
    const isActive = status === "ACTIVE";
    if (!window.confirm(`Bạn có chắc muốn ${isActive ? "dừng" : "mở"} hoạt động phương tiện ${plateNumber} không?`)) return;

    try {
      const updated = await updateVehicleStatus(id, !isActive);
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === id ? { ...v, status: updated.status } : v
        )
      );
      alert(`Phương tiện ${plateNumber} đã chuyển sang trạng thái ${updated.status === "ACTIVE" ? "Hoạt động" : "Dừng hoạt động"} thành công!`);
    } catch (err) {
      alert("Thay đổi trạng thái thất bại: " + err.message);
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
                    <span className={`${styles.status} ${isActive ? styles.active : styles.stopped}`}>
                      {isActive ? "Hoạt động" : "Dừng hoạt động"}
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(v.id, v.plateNumber)}>
                      <FaTrash />
                    </button>
                    <button className={styles.lockBtn} onClick={() => handleToggleStatus(v.id, v.status, v.plateNumber)}>
                      {isActive ? <FaUnlock /> : <FaLock />}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
};

export default Vehicle;
