import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLeft}>
        <span>
          © 2025 <strong>ETC - SIMULATION - SYSTEM Dashboard</strong>. All rights reserved.
        </span>
      </div>

      <div className={styles.footerRight}>
        <span>Version 1.0.0</span>
      </div>
    </footer>
  );
};

export default Footer;
