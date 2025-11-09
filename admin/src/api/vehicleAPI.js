// src/api/vehicleAPI.js
import { BASE_URL } from "./index";

// Lấy danh sách phương tiện
export const getVehicles = async () => {
  try {
    const res = await fetch(`${BASE_URL}/vehicles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Nếu backend dùng JWT:
        // "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Không thể lấy dữ liệu phương tiện");
    return data; // [{id, licensePlate, type, owner, rfid, active}, ...]
  } catch (err) {
    throw err;
  }
};

// Thêm phương tiện mới
export const addVehicle = async (vehicle) => {
  try {
    const res = await fetch(`${BASE_URL}/vehicles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vehicle),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Không thể thêm phương tiện");
    return data;
  } catch (err) {
    throw err;
  }
};

// Xóa phương tiện
export const deleteVehicle = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/vehicles/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Xóa thất bại");
    }

    return true;
  } catch (err) {
    throw err;
  }
};

// Khóa / mở khóa phương tiện
export const toggleVehicleActive = async (id, active) => {
  try {
    const res = await fetch(`${BASE_URL}/vehicles/${id}/toggle-active`, {
      method: "PUT",
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Thay đổi trạng thái thất bại");
    }

    const data = await res.json();
    return data; // {id, active: true/false}
  } catch (err) {
    throw err;
  }
};
