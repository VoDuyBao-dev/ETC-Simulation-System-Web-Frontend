import React, { useEffect, useState } from "react";
import styles from "./Vehicle.module.scss";
import { FaTrash, FaCar, FaIdCard, FaLock, FaUnlock } from "react-icons/fa";
import Pagination from "../../components/pagination/pagination";
import { getVehicles, deleteVehicle, toggleVehicleActive } from "../../api/vehicleAPI";

const Vehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // === Lấy danh sách phương tiện từ backend khi load page ===
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getVehicles();
        setVehicles(data);
      } catch (err) {
        alert("Lỗi khi tải danh sách phương tiện: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  // === Xóa phương tiện ===
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa phương tiện này không?")) return;

    try {
      await deleteVehicle(id);
      setVehicles(vehicles.filter((v) => v.id !== id));
      alert("Xóa thành công!");
    } catch (err) {
      alert("Xóa thất bại: " + err.message);
    }
  };

  // === Khóa / mở khóa phương tiện ===
  const handleToggleActive = async (id) => {
    const vehicle = vehicles.find((v) => v.id === id);
    if (!vehicle) return;
    if (!window.confirm("Bạn có chắc muốn thay đổi trạng thái phương tiện này không?")) return;

    try {
      const updated = await toggleVehicleActive(id, vehicle.active);
      setVehicles(
        vehicles.map((v) =>
          v.id === id ? { ...v, active: updated.active } : v
        )
      );
      alert(`Phương tiện ${vehicle.licensePlate} đã chuyển sang trạng thái ${updated.active ? "Hoạt động" : "Dừng hoạt động"} thành công!`);
    } catch (err) {
      alert("Thay đổi trạng thái thất bại: " + err.message);
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className={styles.vehiclePage}>
      <div className={styles.header}>
        <h2>Quản lý Phương tiện</h2>
      </div>

      {/* ===== Bảng phương tiện ===== */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th><FaCar /> Biển số</th>
              <th>Loại xe</th>
              <th>Chủ sở hữu</th>
              <th><FaIdCard /> RFID / E-Tag</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.licensePlate}</td>
                <td>{v.type}</td>
                <td>{v.owner}</td>
                <td>{v.rfid}</td>
                <td>
                  <span className={`${styles.status} ${v.active ? styles.active : styles.stopped}`}>
                    {v.active ? "Hoạt động" : "Dừng hoạt động"}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(v.id)}>
                    <FaTrash />
                  </button>
                  <button className={styles.lockBtn} onClick={() => handleToggleActive(v.id)}>
                    {v.active ? <FaUnlock /> : <FaLock />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination />
    </div>
  );
};

export default Vehicle;
