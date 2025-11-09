import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import styles from "./Charts.module.scss";

ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function BarChart() {
  const data = {
    labels: ["Trạm 1", "Trạm 2", "Trạm 3", "Trạm 4", "Trạm 5"],
    datasets: [
      {
        label: "Campaign Performance",
        data: [85, 70, 65, 55, 50 ],
        backgroundColor: ["#2b6cb0", "#408bc0ff", "#63b3ed", "#90cdf4", "#bee3f8"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    indexAxis: "y",
  };

  return (
    <div className={styles.chartBox}>
      <h2>Top 5 trạm có doanh thu cao nhất</h2>
      <Bar data={data} options={options} />
    </div>
  );
}
