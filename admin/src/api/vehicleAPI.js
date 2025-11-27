// src/api/vehicleAPI.js
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
 * Lấy danh sách phương tiện
 * @returns {Promise<Array>} result là mảng phương tiện
 */
export const getVehicles = async () => {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const res = await fetch(`${BASE_URL}/admin/vehicles`, {
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

  if (!res.ok) throw new Error(data.message || "Không thể tải danh sách phương tiện");

  return data.result || [];
};

/**
 * Thêm phương tiện mới
 * @param {object} vehicle - { name, type, plate, ... }
 * @returns {Promise<object>} phương tiện vừa thêm
 */
export const addVehicle = async (vehicle) => {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const res = await fetch(`${BASE_URL}/admin/vehicles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(vehicle),
  });

  const data = await parseJSON(res);

  if (res.status === 401) {
    localStorage.removeItem("token");
    throw new Error(data.message || "Chưa đăng nhập hoặc token hết hạn");
  }

  if (!res.ok) throw new Error(data.message || "Thêm phương tiện thất bại");

  return data.result || {};
};

/**
 * Xóa phương tiện
 * @param {number|string} id - vehicleId
 * @returns {Promise<boolean>}
 */
export const deleteVehicle = async (id) => {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const res = await fetch(`${BASE_URL}/admin/vehicles/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await parseJSON(res);
    throw new Error(data.message || "Xóa phương tiện thất bại");
  }

  return true;
};

/**
 * Cập nhật trạng thái phương tiện
 * @param {number|string} id - vehicleId
 * @param {boolean} active - true: ACTIVE, false: INACTIVE
 * @returns {Promise<object>} phương tiện đã cập nhật
 */
export const updateVehicleStatus = async (id, active) => {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const status = active ? "ACTIVE" : "INACTIVE";

  const res = await fetch(`${BASE_URL}/admin/vehicles/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  const data = await parseJSON(res);

  if (!res.ok) {
    throw new Error(data.message || "Cập nhật trạng thái thất bại");
  }

  return data.result || {};
};