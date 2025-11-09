import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";
import styles from "./Charts.module.scss";
import { getBarChartData } from "~/api/homeAPI";

ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function BarChart() {
  const [chartData, setChartData] = useState({ labels: [], data: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBarChartData();
        setChartData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Top 5 trạm có doanh thu cao nhất",
        data: chartData.data,
        backgroundColor: ["#2b6cb0", "#408bc0ff", "#63b3ed", "#90cdf4", "#bee3f8"],
      },
    ],
  };

  const options = { responsive: true, plugins: { legend: { display: false } }, indexAxis: "y" };

  return (
    <div className={styles.chartBox}>
      <h2>Top 5 trạm có doanh thu cao nhất</h2>
      <Bar data={data} options={options} />
    </div>
  );
}
