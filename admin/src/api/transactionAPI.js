// src/api/transactionAPI.js
import { BASE_URL } from "./index";

/**
 * Lấy danh sách giao dịch từ backend
 * @param {Object} params
 *   - station: tên trạm (string) hoặc undefined / "Tất cả"
 *   - dateFrom: "YYYY-MM-DD" hoặc undefined
 *   - dateTo: "YYYY-MM-DD" hoặc undefined
 */
export const getTransactions = async (params = {}) => {
  try {
    const query = new URLSearchParams();

    if (params.station && params.station !== "Tất cả") query.append("station", params.station);
    if (params.dateFrom) query.append("dateFrom", params.dateFrom);
    if (params.dateTo) query.append("dateTo", params.dateTo);

    const res = await fetch(`${BASE_URL}/transactions?${query.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // nếu backend dùng JWT:
        // "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Không thể lấy danh sách giao dịch");

    return data; // [{id, station, vehicle, amount, time}, ...]
  } catch (err) {
    throw err;
  }
};
