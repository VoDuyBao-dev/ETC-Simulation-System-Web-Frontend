import { BASE_URL } from "./index";

export const login = async (username, password) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Đăng nhập thất bại");
    }

    return data; // { token, user }
  } catch (err) {
    throw err;
  }
};
