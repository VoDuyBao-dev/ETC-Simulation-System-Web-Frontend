// src/pages/transactions/Transactions.js
import React, { useState, useEffect } from "react";
import styles from "./Transactions.module.scss";
import { FaSearch, FaFileExport, FaMoneyBillWave, FaClock, FaMapMarkedAlt } from "react-icons/fa";
import Pagination from "../../components/pagination/pagination";
import { getTransactionsWithFilter } from "../../api/transactionAPI";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Frontend pagination ---
  const [page, setPage] = useState(1); // 1-based
  const pageSize = 10;

  const [filter, setFilter] = useState({
    stationName: "",
    dateFrom: "",
    dateTo: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getTransactionsWithFilter(filter); // API trả mảng
      setTransactions(Array.isArray(data) ? data : []);
      setPage(1); // reset page khi filter
    } catch (err) {
      alert("Lỗi khi tải dữ liệu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Tính transactions hiện tại theo page ---
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const displayTransactions = transactions.slice(start, end);

  // --- Danh sách trạm ---
  const stations = ["Tất cả", ...Array.from(new Set(transactions.map(t => t.stationName)))];

  // --- Thống kê ---
  const stats = {
    count: transactions.length,
    totalAmount: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
  };

  const handleSearch = (e) => {
    e?.preventDefault?.();
    fetchData();
  };

  const handleExport = () => {
    if (!transactions.length) return alert("Không có dữ liệu để xuất.");
    const header = ["STT", "Trạm", "Biển số", "Số tiền", "Thời gian"];
    const rows = transactions.map((r, i) => [
      i + 1,
      r.stationName,
      r.plateNumber,
      r.amount,
      new Date(r.date).toLocaleString(),
    ]);

    const csv = [header, ...rows]
      .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const filename = `transactions_${filter.stationName || "all"}_${filter.dateFrom || "from"}_${filter.dateTo || "to"}.csv`;
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
              value={filter.stationName}
              onChange={(e) => setFilter({ ...filter, stationName: e.target.value === "Tất cả" ? "" : e.target.value })}
            >
              {stations.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
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
              <th>STT</th>
              <th><FaMapMarkedAlt /> Trạm</th>
              <th><FaMoneyBillWave /> Số tiền (VNĐ)</th>
              <th>Biển số xe</th>
              <th><FaClock /> Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {displayTransactions.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: 20 }}>
                  Không có giao dịch theo bộ lọc
                </td>
              </tr>
            ) : (
              displayTransactions.map((t, i) => (
                <tr key={i}>
                  <td>{start + i + 1}</td>
                  <td>{t.stationName}</td>
                  <td>{t.amount?.toLocaleString()}</td>
                  <td>{t.plateNumber}</td>
                  <td>{new Date(t.date).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={Math.ceil(transactions.length / pageSize)}
        onPageChange={setPage}
      />
    </div>
  );
};

export default Transactions;
