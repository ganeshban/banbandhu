import React from "react";
import styles from "./MemberAvatar.module.css";
import { MAHILA, MRITU_BHAISAKEKO } from "../utils/Constants";

const INITIALS_COLOR_MALE = "linear-gradient(135deg, #1e3a2f 0%, #2e6b47 100%)";
const INITIALS_COLOR_FEMALE = "linear-gradient(135deg, #3a1e2f 0%, #6b2e47 100%)";

export default function MemberAvatar({ member, size = 48, highlight = false }) {
  const initials = member.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const bg = member.gender === MAHILA ? INITIALS_COLOR_FEMALE : INITIALS_COLOR_MALE;
  const fontSize = size * 0.36;

  return (
    <div
      className={`${styles.avatar} ${highlight ? styles.highlight : ""}`}
      style={{ width: size, height: size, background: bg }}
      title={member.name}
    >
      {member.photo ? (
        <img src={member.photo} alt={member.name} className={styles.photo} />
      ) : (
        <span style={{ fontSize }}>{initials}</span>
      )}
      {member.dod && <div className={styles.deceased} title={MRITU_BHAISAKEKO} />}
    </div>
  );
}
