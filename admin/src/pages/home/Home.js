import React from "react";
import styles from "./Home.module.scss";
import StatsCards from "../../components/dashboard/statsCard/StatsCards";
import LineChart from "../../components/dashboard/charts/LineChart";
import BarChart from "../../components/dashboard/charts/BarChart";
import ErrorTransactionsTable from "../../components/dashboard/tables/tables"

export default function Home() {
  return (
    <div className={styles.dashboard}>
      <StatsCards />
      <div className={styles.cardLarge}>
        <LineChart />
      </div>
      <div className={styles.row}>
        <div className={styles.cardLarge}>
          <BarChart />
        </div>
        <div className={styles.card}>
          <ErrorTransactionsTable/>
        </div>
      </div>
    </div>
  );
}
