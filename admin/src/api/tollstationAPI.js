// src/api/tollstationAPI.js
import { BASE_URL } from "./index";

const getToken = () => localStorage.getItem("token")?.trim();

/**
 * Helper parse JSON an toàn
 */
const parseJSON = async (res) => {
  const text = await res.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch {}
  return data;
};

/**
 * Lấy danh sách tất cả trạm
 */
export const getStations = async () => {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const res = await fetch(`${BASE_URL}/admin/stations`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await parseJSON(res);

  if (res.status === 401) {
    localStorage.removeItem("token");
    throw new Error(data.message || "Chưa đăng nhập hoặc token hết hạn");
  }

  if (!res.ok) throw new Error(data.message || "Không thể tải danh sách trạm");

  return Array.isArray(data.result) ? data.result : []; // mảng trạm hoặc { content: [...] } tùy backend
};

/**
 * Thêm trạm mới
 * @param {object} station - { name, address, code, latitude, longitude, status }
 */
export const addStation = async (station) => {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const res = await fetch(`${BASE_URL}/admin/stations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(station),
  });

  const data = await parseJSON(res);
  if (!res.ok) throw new Error(data.message || "Thêm trạm thất bại");
  return data;
};

/**
 * Sửa thông tin trạm
 * @param {number|string} id
 * @param {object} update - { name?, address?, latitude?, longitude?, code? }
 */
export const updateStation = async (id, update) => {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const res = await fetch(`${BASE_URL}/admin/stations/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(update),
  });

  const data = await parseJSON(res);
  if (!res.ok) throw new Error(data.message || "Cập nhật trạm thất bại");
  return data;
};

/**
 * Đổi trạng thái trạm
 * @param {number|string} id
 * @param {string} status - "ACTIVE" | "INACTIVE" | "MAINTENANCE"
 */
export const updateStationStatus = async (id, status) => {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const res = await fetch(`${BASE_URL}/admin/stations/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  const data = await parseJSON(res);
  if (!res.ok) throw new Error(data.message || "Thay đổi trạng thái trạm thất bại");
  return data;
};

/**
 * Xóa trạm
 * @param {number|string} id
 */
export const deleteStation = async (id) => {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const res = await fetch(`${BASE_URL}/admin/stations/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const data = await parseJSON(res);
    throw new Error(data.message || "Xóa trạm thất bại");
  }
  return true;
};

/**
 * Lấy thống kê trạm
 */
export const getStationStatistics = async () => {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const res = await fetch(`${BASE_URL}/admin/stations/statistics`, {
    method: "GET",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });

  const data = await parseJSON(res);
  if (!res.ok) throw new Error(data.message || "Không thể lấy thống kê trạm");

  return data; // { totalStations, activeCount, maintenanceCount, inactiveCount, ... }
};
