import React, { useEffect, useState } from "react";
import styles from "./tables.module.scss";
import { getErrorTransactions } from "~/api/homeAPI";

export default function ErrorTransactionsTable() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getErrorTransactions();
        setTransactions(data || []);
      } catch (err) {   
        console.error("Lỗi khi tải giao dịch lỗi:", err);
      }
    };
    fetchData();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "ERROR": return styles.error;
      case "FAILED_BALANCE": return styles.pending;
      default: return "";
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <h2 className={styles.title}>Giao dịch lỗi gần đây</h2>
      <div className={styles.scrollArea}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Trạm thu phí</th>
              <th>Biển số</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: 20 }}>
                  Không có giao dịch lỗi
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.transactionId}>
                  <td>{t.stationCode}</td>
                  <td>{t.plateNumber}</td>
                  <td>{new Date(t.occurredAt).toLocaleString()}</td>
                  <td>
                    <span className={`${styles.status} ${getStatusClass(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
