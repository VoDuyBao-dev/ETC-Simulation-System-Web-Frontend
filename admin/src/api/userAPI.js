import { BASE_URL } from "./index";

// Lấy danh sách người dùng
export const getUsers = async () => {
  try {
    const res = await fetch(`${BASE_URL}/users`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Không thể tải danh sách người dùng");
    return await res.json(); // giả sử backend trả về [{id, name, email, role, active}]
  } catch (err) {
    throw err;
  }
};

// Xóa người dùng
export const deleteUser = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Xóa người dùng thất bại");
    return await res.json();
  } catch (err) {
    throw err;
  }
};

// Khóa / mở khóa người dùng
export const toggleUserActive = async (id, active) => {
  try {
    const res = await fetch(`${BASE_URL}/users/${id}/toggle`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    if (!res.ok) throw new Error("Cập nhật trạng thái thất bại");
    return await res.json();
  } catch (err) {
    throw err;
  }
};
