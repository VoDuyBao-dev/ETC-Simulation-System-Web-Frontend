import React, { useState, useEffect, useCallback } from "react";
import styles from "./Transactions.module.scss";
import { FaSearch, FaFileExport, FaMoneyBillWave, FaClock, FaMapMarkedAlt } from "react-icons/fa";
import Pagination from "../../components/pagination/pagination";
import { getTransactions } from "../../api/transactionAPI";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState({
    station: "Tất cả",
    dateFrom: "",
    dateTo: "",
  });

  // Lấy dữ liệu từ backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getTransactions(filter);
      setTransactions(data);
    } catch (err) {
      alert("Lỗi khi tải dữ liệu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Khi filter thay đổi, reload data
  useEffect(() => {
    fetchData();
  }, [filter]);

  const stations = useCallback(() => {
    const s = Array.from(new Set(transactions.map((t) => t.station)));
    return ["Tất cả", ...s];
  }, [transactions]);

  const filtered = useCallback(() => {
    return transactions; // backend đã filter
  }, [transactions]);

  const stats = useCallback(() => {
    const totalAmount = filtered.reduce((s, x) => s + (x.amount || 0), 0);
    return { count: filtered.length, totalAmount };
  }, [filtered]);

  const handleSearch = (e) => {
    e?.preventDefault?.();
    fetchData();
  };

  const handleExport = () => {
    if (!filtered.length) return alert("Không có dữ liệu để xuất.");
    const header = ["ID", "Trạm", "Biển số", "Số tiền", "Thời gian"];
    const rows = filtered.map((r) => [
      r.id,
      r.station,
      r.vehicle,
      r.amount,
      new Date(r.time).toLocaleString(),
    ]);

    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const filename = `transactions_${filter.station === "Tất cả" ? "all" : filter.station}_${filter.dateFrom || "from"}_${filter.dateTo || "to"}.csv`;
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className={styles.transactionsPage}>
      <div className={styles.header}>
        <h2>Quản lý Giao dịch thu phí</h2>

        <form className={styles.actions} onSubmit={handleSearch}>
          <div className={styles.filterGroup}>
            <label>Trạm</label>
            <select
              value={filter.station}
              onChange={(e) => setFilter({ ...filter, station: e.target.value })}
            >
              {stations.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Từ</label>
            <input
              type="date"
              value={filter.dateFrom}
              onChange={(e) => setFilter({ ...filter, dateFrom: e.target.value })}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Đến</label>
            <input
              type="date"
              value={filter.dateTo}
              onChange={(e) => setFilter({ ...filter, dateTo: e.target.value })}
            />
          </div>

          <button type="submit"><FaSearch /> Tra cứu</button>
          <button type="button" className={styles.exportBtn} onClick={handleExport}>
            <FaFileExport /> Xuất báo cáo
          </button>
        </form>
      </div>

      <div className={styles.stats}>
        <div className={`${styles.card} ${styles.total}`}>
          <h4>Tổng giao dịch</h4>
          <p>{stats.count}</p>
        </div>
        <div className={`${styles.card} ${styles.revenue}`}>
          <h4>Tổng doanh thu (VNĐ)</h4>
          <p>{stats.totalAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th><FaMapMarkedAlt /> Trạm</th>
              <th><FaMoneyBillWave /> Số tiền (VNĐ)</th>
              <th>Biển số xe</th>
              <th><FaClock /> Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: "center", padding: 20 }}>Không có giao dịch theo bộ lọc</td></tr>
            ) : (
              filtered.map((t, i) => (
                <tr key={t.id}>
                  <td>{i + 1}</td>
                  <td>{t.station}</td>
                  <td>{t.amount.toLocaleString()}</td>
                  <td>{t.vehicle}</td>
                  <td>{new Date(t.time).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination/>
    </div>
  );
};

export default Transactions;
