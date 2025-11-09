import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import styles from "./Charts.module.scss";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function LineChart() {
  const data = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
    datasets: [
      {
        label: "Biểu đồ doanh thu",
        data: [120000, 35000, 20000000, 45000, 250000, 12000000, 35000000, 20000000, 45000000, 25000000, 35000000, 22000000],
        fill: true,
        borderColor: "#38b2ac",
        backgroundColor: "rgba(56, 178, 172, 0.2)",
        tension: 0.4,
      },
    ],
  };
  const options = { responsive: true, plugins: { legend: { display: false } } };

  return (
    <div className={styles.chartBox}>
      <h2>Biểu đồ doanh thu</h2>
      <Line data={data} options={options} />
    </div>
  );
}
