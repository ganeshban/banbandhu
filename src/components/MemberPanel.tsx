import React from "react";
import MemberAvatar from "./MemberAvatar";
import styles from "./MemberPanel.module.css";
import { formatDate, getAge, getYearsSince } from "../utils/treeUtils";
import { AAMA_BUBA, BAAL_BACHCHA, BIWAHA, BYAKTIGAT_BIBARAN, getMerriageNumber, JANMA_MITI, JANMA_STHAN, KO_PARIWARIK_BIBARAN, LINGA, MAHILA, MRITU_BHAISAKEKO, PARIWAR, PATI_PATNI, PURUS, SANTAN, SWARGARAN_MITI, UMER } from "../utils/Constants";
export default function MemberPanel({ member, parents, spouses, children, onClose, onNavigate }) {
  if (!member) return null;

  const age = member.dob ? getAge(member.dob, member.dod) : null;
  const yearsSinceDeath = member.dod ? getYearsSince(member.dod) : null;
  const multiSpouse = spouses.length > 1;
  const spouseGroups = spouses.map((spouse) => ({
    spouse,
    childrenForSpouse: (children || []).filter((child) => {
      const parentIds = new Set((child.parents || []).map((parentId) => String(parentId)));
      const memberChildIds = new Set((member.children || []).map((childId) =>
        String(typeof childId === "object" ? childId.id : childId)
      ));
      const spouseChildIds = new Set((spouse.children || []).map((childId) =>
        String(typeof childId === "object" ? childId.id : childId)
      ));
      const childId = String(child.id);
      const belongsToMember = parentIds.has(String(member.id)) || memberChildIds.has(childId);
      const belongsToSpouse = parentIds.has(String(spouse.id)) || spouseChildIds.has(childId);
      return belongsToMember && belongsToSpouse;
    })
  }));

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
        </div>
      </div>
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
              <dd>{formatDate(member.dod)}{yearsSinceDeath !== null && ` (${yearsSinceDeath} वर्ष पहिले)`}</dd>
            </>
          )}
          {member.birthPlace && (
            <>
              <dt>{JANMA_STHAN} </dt>
              <dd>{member.birthPlace}</dd>
            </>
          )}
          {member.currentAddress && (
            <>
              <dt>Halko Address </dt>
              <dd>{member.currentAddress}</dd>
            </>
          )}

          {member.phone && (
            <>
              <dt>Samparka Number </dt>
              <dd>{member.phone}</dd>
            </>
          )}



          {member.gender && (
            <>
              <dt>{LINGA}</dt>
              <dd >{member.gender == "1" ? PURUS : MAHILA}</dd>
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
        {multiSpouse && (
          <div className={styles.section}>

            <h3 className={styles.sectionTitle}><span className={styles.dot} />
              {BIWAHA} & {BAAL_BACHCHA}
            </h3>

            {spouseGroups.map(({ spouse: sid, childrenForSpouse }, i) => (
              <div key={sid.id} className={styles.unionBlock}>
                <div className={styles.unionHeader}>
                  <span className={styles.unionIndex}>
                    {getMerriageNumber(i + 1)}
                  </span>
                </div>

                <div className={styles.relGroup}>
                  <span className={styles.relLabel}>{PATI_PATNI}</span>
                  <button className={styles.relCard} onClick={() => onNavigate(sid.id)}>
                    <MemberAvatar member={sid} size={28} />
                    <span>{sid.name}</span>
                  </button>
                </div>

                {childrenForSpouse.length > 0 && (
                  <div className={styles.relGroup}>
                    <span className={styles.relLabel}>{SANTAN}</span>
                    {childrenForSpouse.map((child) => (
                      <button key={child.id} className={styles.relCard} onClick={() => onNavigate(child.id)}>
                        <MemberAvatar member={child} size={28} />
                        <span>{child.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!multiSpouse && spouses.length > 0 && (
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

        {!multiSpouse && children.length > 0 && (
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

        {parents.length === 0 && spouses.length === 0 && children.length === 0 && (
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
