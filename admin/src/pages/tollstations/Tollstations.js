import React, { useState, useEffect } from "react";
import styles from "./Tollstations.module.scss";
import { FaEdit, FaTrash, FaPlus, FaMapMarkerAlt, FaLock, FaUnlock, FaFilter } from "react-icons/fa";
import Pagination from "../../components/pagination/pagination";
import {
  getStations,
  addStation,
  updateStation,
  updateStationStatus,
  deleteStation,
  getStationStatistics,
} from "../../api/tollstationAPI";

const statusMap = {
  ACTIVE: "Hoạt động",
  MAINTENANCE: "Bảo trì",
  INACTIVE: "Dừng hoạt động",
};

const reverseStatusMap = {
  "Hoạt động": "ACTIVE",
  "Bảo trì": "MAINTENANCE",
  "Dừng hoạt động": "INACTIVE",
};

const TollStationPage = () => {
  const [stations, setStations] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const [form, setForm] = useState({ id: null, name: "", address: "", status: "ACTIVE", lat: "", lng: "" });
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("Tất cả");
  const [selectedMap, setSelectedMap] = useState(null);

  // ==== Lấy dữ liệu
  const fetchStations = async (pageNumber = 1) => {
    try {
      const data = await getStations(pageNumber, size);
      setStations(data.content);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch stations:", err);
      setStations([]);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await getStationStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error("Failed to fetch statistics:", err);
      setStatistics({});
    }
  };

  useEffect(() => {
    fetchStations(page);
    fetchStatistics();
  }, [page]);

  // ==== Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        address: form.address,
        latitude: form.lat,
        longitude: form.lng,
        status: form.status, // backend value
      };
      if (form.id) {
        await updateStation(form.id, payload);
      } else {
        await addStation(payload);
      }
      resetForm();
      fetchStations(page);
      fetchStatistics();
    } catch (err) {
      console.error("Error saving station:", err);
      alert("Có lỗi xảy ra. Kiểm tra console.");
    }
  };

  const handleEdit = (station) => {
    setForm({
      id: station.id,
      name: station.name,
      address: station.address,
      status: station.status,
      lat: station.latitude,
      lng: station.longitude,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa trạm này không?")) return;
    try {
      await deleteStation(id);
      fetchStations(page);
      fetchStatistics();
    } catch (err) {
      console.error("Failed to delete station:", err);
    }
  };

  const handleToggleStatus = async (station) => {
    const newStatus = station.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    if (!window.confirm(`Bạn có chắc muốn chuyển trạng thái trạm "${station.name}" sang ${statusMap[newStatus]}?`)) return;

    try {
      await updateStationStatus(station.id, newStatus);
      fetchStations(page);
      fetchStatistics();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const resetForm = () => {
    setForm({ id: null, name: "", address: "", status: "ACTIVE", lat: "", lng: "" });
    setShowForm(false);
  };

  const filteredStations = filter === "Tất cả" ? stations : stations.filter((s) => {
    if (filter === "Hoạt động") return s.status === "ACTIVE";
    if (filter === "Bảo trì") return s.status === "MAINTENANCE";
    if (filter === "Dừng hoạt động") return s.status === "INACTIVE";
    return true;
  });

  return (
    <div className={styles.page}>
      <h2>Quản lý Trạm thu phí</h2>

      {/* === Thống kê nhanh === */}
      <div className={styles.stats}>
        <div className={`${styles.card} ${styles.total}`}><h4>Tổng số trạm</h4><p>{statistics.totalStations || 0}</p></div>
        <div className={`${styles.card} ${styles.active}`}><h4>Hoạt động</h4><p>{statistics.activeStations || 0}</p></div>
        <div className={`${styles.card} ${styles.maintenance}`}><h4>Bảo trì</h4><p>{statistics.maintenanceStations || 0}</p></div>
        <div className={`${styles.card} ${styles.stopped}`}><h4>Dừng hoạt động</h4><p>{statistics.inactiveStations || 0}</p></div>
      </div>

      {/* === Bộ lọc + nút thêm === */}
      <div className={styles.actions}>
        <div className={styles.filter}>
          <FaFilter />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="Tất cả">Tất cả</option>
            <option value="Hoạt động">Hoạt động</option>
            <option value="Bảo trì">Bảo trì</option>
            <option value="Dừng hoạt động">Dừng hoạt động</option>
          </select>
        </div>
        <button onClick={() => setShowForm(true)}><FaPlus /> Thêm trạm</button>
      </div>

      {/* === Form thêm/sửa === */}
      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input type="text" placeholder="Tên trạm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input type="text" placeholder="Địa chỉ" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="ACTIVE">Hoạt động</option>
            <option value="MAINTENANCE">Bảo trì</option>
            <option value="INACTIVE">Dừng hoạt động</option>
          </select>
          <input type="number" step="any" placeholder="Vĩ độ (lat)" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} required />
          <input type="number" step="any" placeholder="Kinh độ (lng)" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} required />
          <div className={styles.formActions}>
            <button type="submit">Lưu</button>
            <button type="button" onClick={resetForm}>Hủy</button>
          </div>
        </form>
      )}

      {/* === Bảng danh sách trạm === */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã trạm</th>
            <th>Tên trạm</th>
            <th>Địa chỉ</th>
            <th>Trạng thái</th>
            <th>Bản đồ</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredStations.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.address}</td>
              <td>
                <span className={`${styles.status} ${
                  s.status === "ACTIVE" ? styles.active :
                  s.status === "MAINTENANCE" ? styles.maintenance :
                  styles.stopped
                }`}>
                  {statusMap[s.status]}
                </span>
              </td>
              <td><button className={styles.mapBtn} onClick={() => setSelectedMap(s)}><FaMapMarkerAlt /></button></td>
              <td>
                <button className={styles.editBtn} onClick={() => handleEdit(s)}><FaEdit /></button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(s.id)}><FaTrash /></button>
                <button className={styles.toggleBtn} onClick={() => handleToggleStatus(s)}>
                  {s.status === "ACTIVE" ? <FaUnlock /> : <FaLock />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* === Bản đồ mô phỏng === */}
      {selectedMap && (
        <div className={styles.mapContainer}>
          <h3>Bản đồ: {selectedMap.name}</h3>
          <iframe title="map" src={`https://www.google.com/maps?q=${selectedMap.lat},${selectedMap.lng}&hl=vi&z=14&output=embed`} width="100%" height="400" style={{ border: 0 }}></iframe>
          <button onClick={() => setSelectedMap(null)}>Đóng bản đồ</button>
        </div>
      )}

      {/* === Phân trang === */}
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
    </div>
  );
};

export default TollStationPage;
