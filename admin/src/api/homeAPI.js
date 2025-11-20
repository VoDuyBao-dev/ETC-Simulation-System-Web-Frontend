// src/api/homeAPI.js
import { BASE_URL } from "./index";

const getToken = () => localStorage.getItem("token")?.trim();

/**
 * Lấy toàn bộ dashboard data
 * @returns {Promise<object>}
 */
export const getDashboardData = async () => {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const res = await fetch(`${BASE_URL}/admin/dashboard`, {
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

  if (!res.ok) throw new Error(data.message || "Không thể tải dashboard data");

  return data; // { summary, revenueByMonth, top5Stations, failedTransactions, totalFailed }
};

/**
 * Lấy tổng quan StatsCards
 */
export const getStats = async () => {
  const data = await getDashboardData();
  return data.summary; // { totalUsers, totalVehicles, totalStations, totalTransactions, failedTransactions }
};

/**
 * Dữ liệu LineChart (doanh thu theo tháng)
 */
export const getLineChartData = async () => {
  const data = await getDashboardData();
  const labels = data.revenueByMonth.map(r => `${r.year}-${String(r.month).padStart(2, '0')}`);
  const chartData = data.revenueByMonth.map(r => r.amount);
  return { labels, data: chartData };
};

/**
 * Dữ liệu BarChart (Top 5 trạm doanh thu cao nhất)
 */
export const getBarChartData = async () => {
  const data = await getDashboardData();
  const labels = data.top5Stations.map(s => s.stationName);
  const chartData = data.top5Stations.map(s => s.revenue);
  return { labels, data: chartData };
};

/**
 * Giao dịch lỗi gần đây
 */
export const getErrorTransactions = async () => {
  const data = await getDashboardData();
  return data.failedTransactions || [];
};
