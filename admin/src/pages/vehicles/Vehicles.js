import React, { useState } from "react";
import styles from "./Vehicle.module.scss";
import {
  FaTrash,
  FaCar,
  FaIdCard,
  FaLock,
  FaUnlock,
} from "react-icons/fa";
import Pagination from "../../components/pagination/pagination";

const Vehicle = () => {
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      licensePlate: "51A-123.45",
      type: "Ô tô",
      owner: "Nguyễn Văn A",
      rfid: "RF123456",
      active: true,
    },
    {
      id: 2,
      licensePlate: "59B1-678.90",
      type: "Xe máy",
      owner: "Trần Thị B",
      rfid: "RF789012",
      active: false,
    },
  ]);
  // === Xóa phương tiện ===
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa phương tiện này không?")) {
      setVehicles(vehicles.filter((v) => v.id !== id));
    }
    // Thêm alert
    const vehicle = vehicles.find((v) => v.id === id);
    alert(`Phương tiện ${vehicle.licensePlate} đã được xóa thành công!`);

  };

  // === Khóa / Mở khóa phương tiện ===
  const handleToggleActive = (id) => {
    if (window.confirm("Bạn có chắc muốn thay đổi trạng thái phương tiện này không?")) {
      setVehicles(
        vehicles.map((v) =>
          v.id === id ? { ...v, active: !v.active } : v
        )
      );
    }

    const vehicle = vehicles.find((v) => v.id === id);
    const newStatus = vehicle.active ? "dừng hoạt động" : "hoạt động";
    alert(`Phương tiện ${vehicle.licensePlate} đã được chuyển sang trạng thái ${newStatus} thành công!`);
  };

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
                  <span
                    className={`${styles.status} ${
                      v.active ? styles.active : styles.stopped
                    }`}
                  >
                    {v.active ? "Hoạt động" : "Dừng hoạt động"}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(v.id)}
                  >
                    <FaTrash />
                  </button>
                  <button
                    className={styles.lockBtn}
                    onClick={() => handleToggleActive(v.id)}
                  >
                    {v.active ? <FaUnlock/> : <FaLock />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination/>

    </div>
  );
};

export default Vehicle;
