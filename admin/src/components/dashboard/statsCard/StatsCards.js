import React from "react";
import styles from "./StatsCards.module.scss";
import users from '~/assets/imgs/users.jpg';
import vehicles from '~/assets/imgs/vehicles.jpg';
import tollstations from '~/assets/imgs/tollstations.jpg'

export default function StatsCards() {
  const stats = [
    { title: "Người dùng", value: "2,500", change: "+14%", img: users },
    { title: "Phương tiện", value: "3,050", change: "+5%", img: vehicles },
    { title: "Trạm thu phí", value: "450", change: "+7%", img: tollstations },
  ];

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
              <img src={item.img}></img>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
