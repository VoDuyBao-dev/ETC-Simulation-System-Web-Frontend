// src/api/transactionsAPI.js
import { BASE_URL } from "./index";

const getToken = () => localStorage.getItem("token")?.trim();

/**
 * Lấy danh sách giao dịch thu phí, có phân trang
 * @param {number} page - số trang (0-based)
 * @param {number} size - số giao dịch/trang
 * @returns {Promise<{content: Array, page: number, size: number, totalElements: number, totalPages: number}>}
 */
export const getTransactions = async (page = 0, size = 20) => {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const res = await fetch(`${BASE_URL}/admin/toll-transactions/transactions?page=${page}&size=${size}`, {
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

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    throw new Error(data.message || "Chưa đăng nhập hoặc token hết hạn");
  }

  if (!res.ok) throw new Error(data.message || "Không thể tải danh sách giao dịch");

  // Trả về object giống paging chuẩn FE nhận { content, page, size, totalElements, totalPages }
  return {
    content: data.result?.content || [],
    page: data.result?.number || 0,
    size: data.result?.size || size,
    totalElements: data.result?.totalElements || 0,
    totalPages: data.result?.totalPages || 1,
  };
};

/**
 * Tùy chọn: lọc giao dịch theo trạm hoặc thời gian có thể thêm params filter
 * Ví dụ:
 * @param {object} filter - { stationName, dateFrom, dateTo }
 */
export const getTransactionsWithFilter = async (filter = {}, page = 0, size = 20) => {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const params = new URLSearchParams({
    page,
    size,
    ...(filter.stationName ? { stationName: filter.stationName } : {}),
    ...(filter.dateFrom ? { dateFrom: filter.dateFrom } : {}),
    ...(filter.dateTo ? { dateTo: filter.dateTo } : {}),
  });

  const res = await fetch(`${BASE_URL}/admin/toll-transactions/transactions?${params.toString()}`, {
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

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    throw new Error(data.message || "Chưa đăng nhập hoặc token hết hạn");
  }

  if (!res.ok) throw new Error(data.message || "Không thể tải danh sách giao dịch");

  return {
    content: data.result?.content || [],
    page: data.result?.number || 0,
    size: data.result?.size || size,
    totalElements: data.result?.totalElements || 0,
    totalPages: data.result?.totalPages || 1,
  };
};
