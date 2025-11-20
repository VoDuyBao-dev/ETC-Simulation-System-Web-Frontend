// src/api/logoutAPI.js
import { BASE_URL } from "./index";

/**
 * Logout user
 */
export const logout = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Không có token để logout");

  try {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ token }), // backend của bạn yêu cầu body
    });

    const text = await res.text();
    const data = JSON.parse(text);

    // Xóa token sau khi logout
    localStorage.removeItem("token");

    return data;

  } catch (err) {
    throw new Error(err.message || "Lỗi kết nối backend");
  }
};
