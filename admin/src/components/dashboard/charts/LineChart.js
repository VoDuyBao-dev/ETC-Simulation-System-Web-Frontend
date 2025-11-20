import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  LineElement, 
  CategoryScale, 
  LinearScale, 
  PointElement,
  Filler // <-- import Filler plugin
} from "chart.js";
import styles from "./Charts.module.scss";
import { getLineChartData } from "~/api/homeAPI";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler); // <-- đăng ký Filler

export default function LineChart() {
  const [chartData, setChartData] = useState({ labels: [], data: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLineChartData();
        setChartData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className={styles.chartBox}>Đang tải biểu đồ...</div>;

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: chartData.data,
        fill: true, // bây giờ fill sẽ hoạt động
        borderColor: "#38b2ac",
        backgroundColor: "rgba(56, 178, 172, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = { 
    responsive: true,
    plugins: { 
      legend: { display: false } 
    } 
  };

  return (
    <div className={styles.chartBox}>
      <h2>Biểu đồ doanh thu</h2>
      <Line data={data} options={options} />
    </div>
  );
}
