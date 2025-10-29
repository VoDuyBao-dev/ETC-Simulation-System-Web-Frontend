import styles from "./Notification.module.scss";
import { FaChevronRight } from "react-icons/fa";

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      name:"Giao dịch mới tại Trạm A",
      time: "3 phút trước",
      message: "Xe 51A-123.45 vừa qua trạm, phí thu 30.000đ.",
      avatar: "https://i.pravatar.cc/50",
    },
    
    {
      id: 2,
      name: "Trạm B đang bảo trì",
      time: "10 phút trước",
      message: "Trạm tạm dừng hoạt động từ 10:00 - 12:00 hôm nay.",
      avatar: "https://i.pravatar.cc/50",
    },
    
    {
      id: 3,
      name: "Xe chưa đủ số dư",
      time: "25 phút trước",
      message: "Xe 59B1-678.90 không đủ tiền để qua trạm C.",
      avatar: "https://i.pravatar.cc/50",
    },
    
    {
      id: 4,
      name: "Doanh thu đạt mốc mới",
      message: "Tổng doanh thu hôm nay đã vượt 2.000.000đ!",
      time: "1 giờ trước",
      avatar: "https://i.pravatar.cc/50",
    },
  ];

  return (
    <div className={styles.dropdown}>
      {notifications.map((item) => (
        <div key={item.id} className={styles.notificationItem}>
          <img src={item.avatar} alt={item.name} />
          <div className={styles.text}>
            <div className={styles.topRow}>
              <span className={styles.name}>{item.name}</span>
              <span className={styles.time}>{item.time}</span>
            </div>
            <p>{item.message}</p>
          </div>
        </div>
      ))}
      <div className={styles.seeAll}>
        See All Alerts <FaChevronRight />
      </div>
    </div>
  );
};

export default Notifications;
