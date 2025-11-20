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
 * Lấy danh sách phương tiện phân trang
 * @param {number} page - số trang (1-based)
 * @param {number} size - số item/trang
 */
export const getVehicles = async (page = 1, size = 5) => {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const res = await fetch(`${BASE_URL}/admin/vehicles?page=${page}&size=${size}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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

  return data; // { content: [...], page, size, totalElements, totalPages }
};

/**
 * Thêm phương tiện mới
 * @param {object} vehicle - { name, type, plate, ... }
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

  return data; // { id, name, type, ... }
};

/**
 * Xóa phương tiện
 * @param {number|string} id - vehicleId
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
    throw new Error(data.message || "Xóa thất bại");
  }

  return true;
};

/**
 * Cập nhật trạng thái phương tiện
 * @param {number|string} id - vehicleId
 * @param {boolean} status- true: active, false: locked
 */
export const updateVehicleStatus = async (id, active) => {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const status = active ? "ACTIVE" : "INACTIVE";

  const res = await fetch(`${BASE_URL}/admin/vehicles/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  const data = await parseJSON(res);

  if (!res.ok) {
    console.warn("Backend message:", data);
    throw new Error(data.message || "Cập nhật trạng thái thất bại");
  }

  return data;
};
