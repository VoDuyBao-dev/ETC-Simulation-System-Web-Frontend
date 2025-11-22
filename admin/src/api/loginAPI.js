// src/api/loginAPI.js
import { BASE_URL } from "./index";

/**
 * Login user và trả về { token, user }
 */
export const login = async (username, password) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/loginAdmin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const text = await res.text();
    let data = {};
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Backend không trả JSON hợp lệ");
    }

    if (!res.ok) {
      throw new Error(data.message || `Đăng nhập thất bại (${res.status})`);
    }

    // Lưu token vào localStorage
    if (data.result?.token) {
      localStorage.setItem("token", data.result.token);
    }

    return data.result;

  } catch (err) {
    throw new Error(err.message || "Lỗi kết nối backend");
  }
};
