import React, { useState, useEffect } from "react";
import styles from "./Tollstations.module.scss";
import { FaEdit, FaTrash, FaPlus, FaMapMarkerAlt, FaFilter } from "react-icons/fa";
import Pagination from "../../components/pagination/pagination";
import {
  getTollStations,
  addTollStation,
  updateTollStation,
  deleteTollStation,
} from "../../api/tollstationAPI";

const TollStationPage = () => {
  const [stations, setStations] = useState([]);
  const [form, setForm] = useState({ id: null, name: "", location: "", status: "Hoạt động", lat: "", lng: "" });
  const [filter, setFilter] = useState("Tất cả");
  const [showForm, setShowForm] = useState(false);
  const [selectedMap, setSelectedMap] = useState(null);

  // ==== Lấy dữ liệu từ backend
  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const data = await getTollStations();
      setStations(data);
    } catch (err) {
      console.error("Failed to fetch toll stations:", err);
    }
  };

  const filteredStations = filter === "Tất cả" ? stations : stations.filter((s) => s.status === filter);

  const total = stations.length;
  const active = stations.filter((s) => s.status === "Hoạt động").length;
  const maintenance = stations.filter((s) => s.status === "Bảo trì").length;
  const stopped = stations.filter((s) => s.status === "Dừng hoạt động").length;

  // ==== Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await updateTollStation(form);
      } else {
        await addTollStation(form);
      }
      fetchStations();
      resetForm();
    } catch (err) {
      console.error("Error saving toll station:", err);
      alert("Có lỗi xảy ra. Kiểm tra console.");
    }
  };

  const handleEdit = (station) => {
    setForm(station);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa trạm này không?")) {
      try {
        await deleteTollStation(id);
        fetchStations();
      } catch (err) {
        console.error("Failed to delete toll station:", err);
      }
    }
  };

  const resetForm = () => {
    setForm({ id: null, name: "", location: "", status: "Hoạt động", lat: "", lng: "" });
    setShowForm(false);
  };

  return (
    <div className={styles.page}>
      <h2>Quản lý Trạm thu phí</h2>

      {/* === Thống kê nhanh === */}
      <div className={styles.stats}>
        <div className={`${styles.card} ${styles.total}`}><h4>Tổng số trạm</h4><p>{total}</p></div>
        <div className={`${styles.card} ${styles.active}`}><h4>Hoạt động</h4><p>{active}</p></div>
        <div className={`${styles.card} ${styles.maintenance}`}><h4>Bảo trì</h4><p>{maintenance}</p></div>
        <div className={`${styles.card} ${styles.stopped}`}><h4>Dừng hoạt động</h4><p>{stopped}</p></div>
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
          <input type="text" placeholder="Vị trí (tỉnh/thành)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="Hoạt động">Hoạt động</option>
            <option value="Bảo trì">Bảo trì</option>
            <option value="Dừng hoạt động">Dừng hoạt động</option>
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
            <th>Vị trí</th>
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
              <td>{s.location}</td>
              <td><span className={`${styles.status} ${s.status === "Hoạt động" ? styles.active : s.status === "Bảo trì" ? styles.maintenance : styles.stopped}`}>{s.status}</span></td>
              <td><button className={styles.mapBtn} onClick={() => setSelectedMap(s)}><FaMapMarkerAlt /></button></td>
              <td>
                <button className={styles.editBtn} onClick={() => handleEdit(s)}><FaEdit /></button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(s.id)}><FaTrash /></button>
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
      <Pagination/>
    </div>
  );
};

export default TollStationPage;
