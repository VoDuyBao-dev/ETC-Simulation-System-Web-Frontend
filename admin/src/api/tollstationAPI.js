import { BASE_URL } from "./index"; 

export const getTollStations = async () => {
  try {
    const res = await fetch(`${BASE_URL}/tollstations`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Lấy danh sách trạm thất bại");
    return data;
  } catch (err) {
    throw err;
  }
};

export const addTollStation = async (station) => {
  try {
    const res = await fetch(`${BASE_URL}/tollstations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(station),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Thêm trạm thất bại");
    return data;
  } catch (err) {
    throw err;
  }
};

export const updateTollStation = async (station) => {
  try {
    const res = await fetch(`${BASE_URL}/tollstations/${station.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(station),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Cập nhật trạm thất bại");
    return data;
  } catch (err) {
    throw err;
  }
};

export const deleteTollStation = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/tollstations/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Xóa trạm thất bại");
    return data;
  } catch (err) {
    throw err;
  }
};
