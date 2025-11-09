import React, { useEffect, useState } from "react";
import styles from "./tables.module.scss";
import { getErrorTransactions } from "~/api/homeAPI";

export default function ErrorTransactionsTable() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getErrorTransactions();
        setTransactions(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Lỗi xác thực": return styles.pending;
      case "GD bị lỗi": return styles.processing;
      case "Đéo đủ tiền": return styles.error;
      default: return "";
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
                <td><span className={`${styles.status} ${getStatusClass(t.status)}`}>{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
