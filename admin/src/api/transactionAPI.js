// src/api/transactionsAPI.js
import { BASE_URL } from "./index";

const getToken = () => localStorage.getItem("token")?.trim();

/**
 * Lấy toàn bộ danh sách giao dịch (backend KHÔNG phân trang)
 * FE sẽ tự phân trang
 */
export const getTransactions = async () => {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const res = await fetch(`${BASE_URL}/admin/toll-transactions/transactions`, {
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

  // Backend trả { code, message, result: [...] }
  return data.result || [];
};

/**
 * Lọc giao dịch (backend KHÔNG phân trang)
 */
export const getTransactionsWithFilter = async (filter = {}) => {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const params = new URLSearchParams({
    ...(filter.stationName ? { stationName: filter.stationName } : {}),
    ...(filter.dateFrom ? { dateFrom: filter.dateFrom } : {}),
    ...(filter.dateTo ? { dateTo: filter.dateTo } : {}),
  });

  const res = await fetch(
    `${BASE_URL}/admin/toll-transactions/transactions?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

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

  return data.result || [];
};
