import React from "react";
import type { Member } from "../model/Member";
import styles from "./MemberAvatar.module.css";

interface MemberAvatarProps {
  member: Member;
  size?: number;
  highlight?: boolean;
}

function getSizeClass(size: number) {
  if (size <= 28) return styles.sizeSm;
  if (size <= 44) return styles.sizeMd;
  if (size <= 72) return styles.sizeLg;
  return styles.sizeXl;
}

export default function MemberAvatar({ member, size = 48, highlight = false }: MemberAvatarProps) {
  const initials = member.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isFemale = member.gender === "2" || member.gender === 2;
  const sizeClass = getSizeClass(size);

  return (
    <div
      className={[
        "rounded-circle",
        "d-flex",
        "align-items-center",
        "justify-content-center",
        "flex-shrink-0",
        styles.avatar,
        sizeClass,
        isFemale ? styles.female : styles.male,
        highlight ? styles.highlight : "",
      ].join(" ")}
      title={member.name}
    >
      {member.photoUrl || member.photoURL ? (
        <img src={member.photoUrl ?? member.photoURL ?? ""} alt={member.name} className={styles.photo} />
      ) : (
        <span className={`${styles.initials} ${isFemale ? styles.femaleText : styles.maleText}`}>{initials}</span>
      )}
    </div>
  );
}
