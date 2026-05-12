import React from "react";
import styles from "./Header.module.css";
import { BIBARAN, KHOJNUHOS, MA_HERNE, PARIWAR } from "../utils/Constants";

export default function Header({ activeTab, onTabChange, familyName }) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <svg className={styles.logo} width="26" height="26" viewBox="0 0 26 26" fill="none">
          <circle cx="13" cy="5" r="3" stroke="var(--gold)" strokeWidth="1.5" />
          <circle cx="6" cy="17" r="3" stroke="var(--gold)" strokeWidth="1.5" />
          <circle cx="20" cy="17" r="3" stroke="var(--gold)" strokeWidth="1.5" />
          <path d="M13 8v4M13 12L6 14M13 12L20 14" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <span className={styles.brandName}>{familyName} <em>{PARIWAR} {BIBARAN}</em></span>
      </div>

      <nav className={styles.nav}>
        <button
          className={`${styles.tab} ${activeTab === "tree" ? styles.active : ""}`}
          onClick={() => onTabChange("tree")}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="3" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="11" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M7 4v2.5M7 6.5L3 9M7 6.5L11 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Tree {MA_HERNE}
        </button>
        <button
          className={`${styles.tab} ${activeTab === "lookup" ? styles.active : ""}`}
          onClick={() => onTabChange("lookup")}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          {KHOJNUHOS}
        </button>
      </nav>
    </header>
  );
}
