import React from "react";
import MemberAvatar from "./MemberAvatar";
import styles from "./MemberPanel.module.css";
import { formatDate, getAge } from "../utils/treeUtils";
import { AAMA_BUBA, BYAKTIGAT_BIBARAN, JANMA_MITI, JANMA_STHAN, KO_PARIWARIK_BIBARAN, LINGA, MRITU_BHAISAKEKO, PARIWAR, PATI_PATNI, SANTAN, SWARGARAN_MITI, UMER } from "../utils/Constants";
export default function MemberPanel({ member, parents, spouses, children, onClose, onNavigate }) {
  if (!member) return null;

  const age = member.dob ? getAge(member.dob, member.dod) : null;

  return (
    <aside className={`${styles.panel} animate-slide`}>
      <button className={styles.close} onClick={onClose} aria-label="Close panel">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <div className={styles.header}>
        <MemberAvatar member={member} size={72} highlight />
        <div className={styles.headerInfo}>
          <h2 className={styles.name}>{member.otherName ?? member.name}</h2>
          <h5 className={styles.name}>{member.otherName ? `(${member.name})` : ""}</h5>

          {member.dod && <span className={styles.deceasedBadge}>{MRITU_BHAISAKEKO}</span>}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.dot} />
          {BYAKTIGAT_BIBARAN}
        </h3>
        <dl className={styles.dl}>
          {member.dob && (
            <>
              <dt>{JANMA_MITI}</dt>
              <dd>{formatDate(member.dob)}{age !== null && ` (${UMER} ${age})`}</dd>
            </>
          )}
          {member.dod && (
            <>
              <dt>{SWARGARAN_MITI}</dt>
              <dd>{formatDate(member.dod)}</dd>
            </>
          )}
          {member.birthPlace && (
            <>
              <dt>{JANMA_STHAN} </dt>
              <dd>{member.birthPlace}</dd>
            </>
          )}



          {member.gender && (
            <>
              <dt>{LINGA}</dt>
              <dd >{member.gender}</dd>
            </>
          )}


        </dl>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.dot} />
          {PARIWAR}
        </h3>

        {parents.length > 0 && (
          <div className={styles.relGroup}>
            <span className={styles.relLabel}>{AAMA_BUBA}</span>
            {parents.map((p) => (
              <button key={p.id} className={styles.relCard} onClick={() => onNavigate(p.id)}>
                <MemberAvatar member={p} size={28} />
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        )}

        {spouses.length > 0 && (
          <div className={styles.relGroup}>
            <span className={styles.relLabel}>{PATI_PATNI}</span>
            {spouses.map((s) => (
              <button key={s.id} className={styles.relCard} onClick={() => onNavigate(s.id)}>
                <MemberAvatar member={s} size={28} />
                <span>{s.name}</span>
              </button>

            ))}

          </div>
        )}

        {children.length > 0 && (
          <div className={styles.relGroup}>
            <span className={styles.relLabel}>{SANTAN}</span>
            {children.map((c) => (
              <button key={c.id} className={styles.relCard} onClick={() => onNavigate(c.id)}>
                <MemberAvatar member={c} size={28} />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        )}

        {parents.length === 0 && !spouses && children.length === 0 && (
          <p className={styles.empty}>No family relations recorded.</p>
        )}
      </div>

      <button className={styles.focusBtn} onClick={() => onNavigate(member.id)}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="7" cy="7" r="2" fill="currentColor" />
        </svg>
        {member.name.split(" ")[0]}{KO_PARIWARIK_BIBARAN}
      </button>
    </aside>
  );
}
