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

const TollStationPage = () => {
  const [stations, setStations] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [page, setPage] = useState(1); // 1-based page
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [form, setForm] = useState({ id: null, name: "", address: "", status: "ACTIVE", lat: "", lng: "" });
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("Tất cả");
  const [selectedMap, setSelectedMap] = useState(null);
  const [loading, setLoading] = useState(true);


  // ==== Lấy dữ liệu
  const fetchStations = async () => {
    setLoading(true);
    try {
      const data = await getStations();
      const list = Array.isArray(data) ? data : data.content || [];

      // 2 dòng lọc trạm đã xóa
      const deleted = JSON.parse(localStorage.getItem("deletedStations")) || [];
      const filteredList = list.filter((s) => !deleted.includes(s.id));

      setStations(filteredList);
      setTotalPages(Math.ceil(filteredList.length / size));
    } catch (err) {
      console.error("Failed to fetch stations:", err);
      setStations([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };


  const fetchStatistics = async () => {
    try {
      const stats = await getStationStatistics();
      setStatistics(stats || {});
    } catch (err) {
      console.error("Failed to fetch statistics:", err);
      setStatistics({});
    }
  };

  useEffect(() => {
    fetchStations();
    fetchStatistics();
  }, []);

  // ==== Phân trang frontend
  const pagedStations = stations
    .filter((s) => {
      if (filter === "Tất cả") return true;
      if (filter === "Hoạt động") return s.status === "ACTIVE";
      if (filter === "Bảo trì") return s.status === "MAINTENANCE";
      if (filter === "Dừng hoạt động") return s.status === "INACTIVE";
      return true;
    })
    .slice((page - 1) * size, page * size);

  // ==== Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        address: form.address,
        status: form.status,
        latitude: form.latitude,
        longitude: form.longitude,
        
      };
      if (form.id) {
        await updateStation(form.id, payload);
        await updateStationStatus(form.id, form.status);
      } else {
        await addStation({ ...payload, status: form.status });
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
      latitude: station.latitude,
      longitude: station.longitude,
    });
    setShowForm(true);
  };

  const loadDeletedStations = () => {
    try {
      return JSON.parse(localStorage.getItem("deletedStations")) || [];
    } catch {
      return [];
    }
  };

  const saveDeletedStations = (ids) => {
    localStorage.setItem("deletedStations", JSON.stringify(ids));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa trạm này không?")) return;

    try {
      // 1️⃣ Backend: chuyển thành INACTIVE
      await updateStationStatus(id, "INACTIVE");

      // 2️⃣ Lưu vào LocalStorage để ẩn khi reload
      const deleted = loadDeletedStations();
      const updated = [...deleted, id];
      saveDeletedStations(updated);

      // 3️⃣ Xóa khỏi UI
      const newList = stations.filter((s) => s.id !== id);
      setStations(newList);

      // 4️⃣ Cập nhật phân trang
      setTotalPages(Math.ceil(newList.length / size));

      alert("Xóa trạm thành công!");
    } catch (err) {
      console.error("Failed to delete station:", err);
      alert("Có lỗi xảy ra khi xóa trạm!");
    }
  };


  const handleToggleStatus = async (station) => {
    const newStatus = station.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    if (!window.confirm(`Bạn có chắc muốn chuyển trạng thái trạm "${station.name}" sang ${statusMap[newStatus]}?`)) return;

    try {
      await updateStationStatus(station.id, newStatus);
      fetchStations();
      fetchStatistics();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const resetForm = () => {
    setForm({ id: null, name: "", address: "", status: "ACTIVE", latitude: "", longitude: "" });
    setShowForm(false);
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

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
          <input type="number" step="any" placeholder="Vĩ độ (lat)" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} required />
          <input type="number" step="any" placeholder="Kinh độ (lng)" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} required />
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
          {pagedStations.map((s) => (
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
          <iframe title="map" src={`https://www.google.com/maps?q=${selectedMap.latitude},${selectedMap.longitude}&hl=vi&z=14&output=embed`} width="100%" height="400" style={{ border: 0 }}></iframe>
          <button onClick={() => setSelectedMap(null)}>Đóng bản đồ</button>
        </div>
      )}

      {/* === Phân trang === */}
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
    </div>
  );
};

export default TollStationPage;
