import { BASE_URL } from "./index";

const getToken = () => localStorage.getItem("token")?.trim();

/**
 * Helper parse JSON an toàn
 */
const parseJSON = async (res) => {
  const text = await res.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch {}
  return data;
};

/**
 * Lấy danh sách người dùng
 */
export const getUsers = async () => {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const res = await fetch(`${BASE_URL}/admin/manager-users`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await parseJSON(res);

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    throw new Error(data.message || "Chưa đăng nhập hoặc token hết hạn");
  }

  if (!res.ok) throw new Error(data.message || "Không thể tải danh sách người dùng");

  return Array.isArray(data.result) ? data.result : [];
};

/**
 * Cập nhật trạng thái người dùng
 * @param {number|string} id
 * @param {"ACTIVE"|"BLOCKED"} status
 */
export const updateUserStatus = async (id, status) => {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const res = await fetch(`${BASE_URL}/admin/manager-users/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  const data = await parseJSON(res);

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    throw new Error(data.message || "Chưa đăng nhập hoặc token hết hạn");
  }

  if (!res.ok) throw new Error(data.message || "Cập nhật trạng thái thất bại");

  // nếu backend trả result là user, dùng luôn
  if (data.result) return data.result;

  // fallback: trả về id + status
  return { userId: id, status };
};
