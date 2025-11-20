// src/api/userAPI.js
import { BASE_URL } from "./index";

const getToken = () => localStorage.getItem("token")?.trim();

/**
 * Lấy danh sách người dùng theo trang
 * @param {number} page - số trang (0-based)
 * @param {number} size - số user/trang
 * @returns {Promise<{content: Array, page: number, size: number, totalElements: number, totalPages: number}>}
 */
export const getUsers = async (page = 0, size = 5) => {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const res = await fetch(`${BASE_URL}/admin/manager-users?page=${page}&size=${size}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await res.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Backend không trả JSON hợp lệ");
  }

  // Nếu 401 → token hết hạn → logout FE
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    throw new Error(data.message || "Chưa đăng nhập hoặc token hết hạn");
  }

  if (!res.ok) throw new Error(data.message || "Không thể tải danh sách người dùng");

  return data; // FE sẽ nhận { content, page, size, totalElements, totalPages }
};

/**
 * Cập nhật trạng thái người dùng
 * @param {number|string} id - userId
 * @param {string} status - "ACTIVE" | "BLOCKED"
 * @returns {Promise<object>}
 */
export const updateUserStatus = async (id, status) => {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const res = await fetch(`${BASE_URL}/admin/manager-users/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  const text = await res.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch {}

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    throw new Error(data.message || "Chưa đăng nhập hoặc token hết hạn");
  }

  if (!res.ok) throw new Error(data.message || "Cập nhật trạng thái thất bại");

  return data;
};
