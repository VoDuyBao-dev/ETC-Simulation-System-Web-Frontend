import React, { useMemo, useState } from "react";
import styles from "./Transactions.module.scss";
import {
  FaSearch,
  FaFileExport,
  FaMoneyBillWave,
  FaClock,
  FaMapMarkedAlt,
} from "react-icons/fa";

/**
 * Transactions page
 * - Filter: station (select), dateFrom, dateTo
 * - Search applies filters locally
 * - Export CSV exports filtered rows
 */

const initialData = [
  { id: 1, station: "Trạm A", vehicle: "51A-123.45", amount: 30000, time: "2025-10-28T08:30:00" },
  { id: 2, station: "Trạm B", vehicle: "59B1-678.90", amount: 15000, time: "2025-10-28T09:10:00" },
  { id: 3, station: "Trạm C", vehicle: "43C-999.88", amount: 45000, time: "2025-10-27T16:45:00" },
  { id: 4, station: "Trạm A", vehicle: "29C-222.33", amount: 20000, time: "2025-10-27T10:05:00" },
  { id: 5, station: "Trạm B", vehicle: "88B-000.11", amount: 50000, time: "2025-10-26T12:20:00" },
];

const Transactions = () => {
  const [transactions] = useState(initialData);

  // filter state
  const [filter, setFilter] = useState({
    station: "Tất cả", // or station name
    dateFrom: "",
    dateTo: "",
  });

  // unique station list (for select)
  const stations = useMemo(() => {
    const s = Array.from(new Set(transactions.map((t) => t.station)));
    return ["Tất cả", ...s];
  }, [transactions]);

  // parsed and filtered transactions
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      // station filter
      if (filter.station !== "Tất cả" && t.station !== filter.station) return false;

      // date filter: compare only date portion
      if (filter.dateFrom) {
        const from = new Date(filter.dateFrom);
        const tDate = new Date(t.time);
        // set from to 00:00:00
        from.setHours(0, 0, 0, 0);
        if (tDate < from) return false;
      }
      if (filter.dateTo) {
        const to = new Date(filter.dateTo);
        const tDate = new Date(t.time);
        // set to to 23:59:59
        to.setHours(23, 59, 59, 999);
        if (tDate > to) return false;
      }
      return true;
    });
  }, [transactions, filter]);

  // stats from filtered
  const stats = useMemo(() => {
    const totalAmount = filtered.reduce((s, x) => s + (x.amount || 0), 0);
    return {
      count: filtered.length,
      totalAmount,
    };
  }, [filtered]);

  // apply quick search (already reactive by binding inputs), but keep a handler in case
  const handleSearch = (e) => {
    e?.preventDefault?.();
    // filter state already updated by inputs — this handler kept for semantic button
  };

  // export CSV of filtered
  const handleExport = () => {
    if (!filtered.length) {
      alert("Không có dữ liệu để xuất.");
      return;
    }
    const header = ["ID", "Trạm", "Biển số", "Số tiền", "Thời gian"];
    const rows = filtered.map((r) => [
      r.id,
      r.station,
      r.vehicle,
      r.amount,
      new Date(r.time).toLocaleString(),
    ]);

    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
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

          <button type="submit" onClick={handleSearch}>
            <FaSearch /> Tra cứu
          </button>

          <button type="button" className={styles.exportBtn} onClick={handleExport}>
            <FaFileExport /> Xuất báo cáo
          </button>
        </form>
      </div>

      {/* quick stats */}
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
    </div>
  );
};

export default Transactions;
