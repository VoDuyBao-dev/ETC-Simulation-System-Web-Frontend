import React, { useEffect, useState } from "react";
import styles from "./StatsCards.module.scss";
import { getStats } from "~/api/homeAPI";
import usersImg from '~/assets/imgs/users.jpg';
import vehiclesImg from '~/assets/imgs/vehicles.jpg';
import tollstationsImg from '~/assets/imgs/tollstations.jpg';

export default function StatsCards() {
  const [stats, setStats] = useState([
    { title: "Người dùng", value: "0", change: "+0%", img: usersImg },
    { title: "Phương tiện", value: "0", change: "+0%", img: vehiclesImg },
    { title: "Trạm thu phí", value: "0", change: "+0%", img: tollstationsImg },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats([
          { title: "Người dùng", value: data.users.toLocaleString(), change: "+14%", img: usersImg },
          { title: "Phương tiện", value: data.vehicles.toLocaleString(), change: "+5%", img: vehiclesImg },
          { title: "Trạm thu phí", value: data.tollstations.toLocaleString(), change: "+7%", img: tollstationsImg },
        ]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className={styles.statsGrid}>
      {stats.map((item, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.row}>
            <div>
              <h3>{item.title}</h3>
              <p className={styles.value}>{item.value}</p>
              <span className={styles.change}>{item.change}</span>
            </div>
            <div>
              <img src={item.img} alt={item.title} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
