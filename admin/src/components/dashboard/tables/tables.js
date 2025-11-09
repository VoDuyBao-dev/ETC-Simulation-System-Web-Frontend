import React from "react";
import styles from "./tables.module.scss";

export default function ErrorTransactionsTable() {
  const transactions = [
    {
      station: "Trạm An Sương",
      time: "2025-11-07 08:23",
      vehicle: "51A-12345",
      status: "Đéo đủ tiền",
    },
    {
      vehicle: "60B-67890",
      station: "Trạm Long Thành",
      time: "2025-11-07 09:10",
      status: "GD bị lỗi",
    },
    {
      vehicle: "30A-99999",
      station: "Trạm Trung Lương",
      time: "2025-11-07 09:45",
      status: "Lỗi xác thực",
    },
    {
      station: "Trạm An Sương",
      time: "2025-11-07 08:23",
      vehicle: "51A-12345",
      status: "Đéo đủ tiền",
    },
    {
      vehicle: "60B-67890",
      station: "Trạm Long Thành",
      time: "2025-11-07 09:10",
      status: "GD bị lỗi",
    },
    {
      vehicle: "30A-99999",
      station: "Trạm Trung Lương",
      time: "2025-11-07 09:45",
      status: "Lỗi xác thực",
    },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "Lỗi xác thực":
        return styles.pending;
      case "GD bị lỗi":
        return styles.processing;
      case "Đéo đủ tiền":
        return styles.error;
      default:
        return "";
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <h2 className={styles.title}>Giao dịch lỗi gần đây</h2>
      <div className={styles.scrollAre}>
        <table className={styles.table}>
            <thead>
            <tr>
                <th>Trạm thu phí</th>
                <th>Phương tiện</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
            </tr>
            </thead>
            <tbody>
            {transactions.map((t, i) => (
                <tr key={i}>
                <td>{t.station}</td>
                <td>{t.vehicle}</td>
                <td>{t.time}</td>
                <td>
                    <span className={`${styles.status} ${getStatusClass(t.status)}`}>
                    {t.status}
                    </span>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}
