// src/pages/transactions/Transactions.js
import React, { useState, useEffect } from "react";
import styles from "./Transactions.module.scss";
import { FaSearch, FaFileExport, FaMoneyBillWave, FaClock, FaMapMarkedAlt } from "react-icons/fa";
import Pagination from "../../components/pagination/pagination";
import { getTransactions } from "../../api/transactionAPI"; // gọi API không filter

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

  // --- Lấy dữ liệu toàn bộ từ backend ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getTransactions(); // API trả tất cả giao dịch
      setTransactions(Array.isArray(data) ? data : []);
      setPage(1); // reset page khi tải dữ liệu
    } catch (err) {
      alert("Lỗi khi tải dữ liệu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Filter frontend ---
  const filteredTransactions = transactions.filter((t) => {
    // lọc theo trạm
    if (filter.stationName && filter.stationName !== "Tất cả" && t.stationName !== filter.stationName)
      return false;

    // lọc theo ngày
    const tDate = new Date(t.date);
    if (filter.dateFrom && tDate < new Date(filter.dateFrom)) return false;
    if (filter.dateTo && tDate > new Date(filter.dateTo)) return false;

    return true;
  });

  // --- Phân trang ---
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const displayTransactions = filteredTransactions.slice(start, end);
  const totalPages = Math.ceil(filteredTransactions.length / pageSize);

  // --- Danh sách trạm ---
  const stations = ["Tất cả", ...Array.from(new Set(transactions.map(t => t.stationName)))];

  // --- Thống kê ---
  const stats = {
    count: filteredTransactions.length,
    totalAmount: filteredTransactions.reduce((sum, t) => sum + (t.amount || 0), 0),
  };

  const handleSearch = (e) => {
    e?.preventDefault?.();
    setPage(1); // reset về trang 1 khi search/filter
  };

  const handleExport = () => {
    if (!filteredTransactions.length) return alert("Không có dữ liệu để xuất.");
    const header = ["STT", "Trạm", "Biển số", "Số tiền", "Thời gian"];
    const rows = filteredTransactions.map((r, i) => [
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
              onChange={(e) => setFilter({ ...filter, stationName: e.target.value })}
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
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default Transactions;
