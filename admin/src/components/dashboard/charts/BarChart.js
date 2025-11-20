import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./Charts.module.scss";
import { getBarChartData } from "~/api/homeAPI";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function BarChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    data: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const barChart = await getBarChartData(); // Lấy từ dashboard API
        setChartData({
          labels: barChart?.labels || [],
          data: barChart?.data || [],
        });
      } catch (err) {
        console.error("Lỗi tải bar chart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChart();
  }, []);

  if (loading) return <div className={styles.chartBox}>Đang tải biểu đồ...</div>;

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: chartData.data,
        backgroundColor: [
          "#2b6cb0",
          "#408bc0ff",
          "#63b3ed",
          "#90cdf4",
          "#bee3f8",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    indexAxis: "y", // Bar ngang
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw.toLocaleString()} VNĐ`,
        },
      },
    },
  };   

  return (
    <div className={styles.chartBox}>
      <h2>Top 5 trạm có doanh thu cao nhất</h2>
      <Bar data={data} options={options} />
    </div>
  );
}
