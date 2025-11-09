import { BASE_URL } from "./index";

// Tổng quan cho StatsCards
export const getStats = async () => {
  const res = await fetch(`${BASE_URL}/dashboard/stats`);
  if (!res.ok) throw new Error("Không thể tải thống kê");
  return await res.json(); // { users, vehicles, tollstations }
};

// Dữ liệu LineChart (doanh thu theo tháng)
export const getLineChartData = async () => {
  const res = await fetch(`${BASE_URL}/dashboard/lineChart`);
  if (!res.ok) throw new Error("Không thể tải line chart");
  return await res.json(); // { labels: [...], data: [...] }
};

// Dữ liệu BarChart (Top 5 trạm doanh thu cao nhất)
export const getBarChartData = async () => {
  const res = await fetch(`${BASE_URL}/dashboard/barChart`);
  if (!res.ok) throw new Error("Không thể tải bar chart");
  return await res.json(); // { labels: [...], data: [...] }
};

// Giao dịch lỗi gần đây
export const getErrorTransactions = async () => {
  const res = await fetch(`${BASE_URL}/dashboard/errorTransactions`);
  if (!res.ok) throw new Error("Không thể tải giao dịch lỗi");
  return await res.json(); // array
};
