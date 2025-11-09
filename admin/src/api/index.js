// src/api/index.js

export const BASE_URL = "http://localhost:8080/etc"; // đổi thành URL backend của bạn

/**
 * Wrapper fetch để gọi API
 * @param {string} url - endpoint (ví dụ: /auth/login)
 * @param {object} options - fetch options (method, headers, body…)
 * @returns {Promise<object>} - trả về data JSON
 */
export const fetchApi = async (url, options = {}) => {
  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      headers: {
        "Content-Type": "application/json",
        // Nếu cần token, bạn có thể thêm:
        // "Authorization": `Bearer ${localStorage.getItem("token")}`,
        ...options.headers,
      },
      ...options,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Lỗi API");
    }

    return data;
  } catch (err) {
    console.error("Fetch API error:", err);
    throw err;
  }
};
