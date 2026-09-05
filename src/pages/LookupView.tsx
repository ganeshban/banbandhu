import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Member } from "../model/Member";
import SearchBar from "../components/SearchBar";
import MemberAvatar from "../components/MemberAvatar";
import styles from "./LookupView.module.css";
import { useFamily } from "../hooks/useFamily";
import { formatDate, getAge, getParentNames } from "../utils/treeUtils";
import { AAMA_BUBA, BAAL_BACHCHA, engToNepNumber, JANMA_MITI, JANMA_STHAN, MAHILA, PURUS, KHOJNE_Q_TEXT, KHOJNUHOS, KO_PARIWARIK_BIBARAN, LINGA, MRITU_BHAISAKEKO, PATI_PATNI, SABAI_JANA, SADASYA, SWARGARAN_MITI, UMER } from "../utils/Constants";

export default function LookupView() {
  const { members, search, getParents, getSpouse, getChildren, loading, error } = useFamily();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Member[]>([]);
  const [selected, setSelected] = useState<Member | null>(null);

  useEffect(() => {
    setSelected(userId ? members.find((member) => String(member.id) === userId) ?? null : null);
  }, [members, userId]);

  function handleSearch(q) {
    setQuery(q);
    setResults(q ? search(q) : []);
    if (!q) setSelected(null);
  }

  function handleSelect(member) {
    setSelected(member);
    setResults([]);
    navigate(`/list/${member.id}`);
  }
  function handleClick(member) {
    handleSelect(member);
  }

  function handleClear() {
    setQuery("");
    setResults([]);
    setSelected(null);
    navigate("/list");
  }

  const parents = selected ? getParents(selected.id) : [];
  const spouse = selected ? getSpouse(selected.id) : [];
  const children = selected ? getChildren(selected.id) : [];

  return (
    <div className={`${styles.page} container-fluid`}>
      <div className={`${styles.hero} container py-4 py-md-5`}>
        <h1 className={styles.heroTitle}>{SADASYA} {KHOJNUHOS}</h1>
        <p className={styles.heroSub}>
          {KHOJNE_Q_TEXT}
        </p>
        <SearchBar
          onSearch={handleSearch}
          results={results}
          onSelect={handleSelect}
          onClear={handleClear}
        />
      </div>

      {loading && <div className="container py-4"><p className="text-secondary">Loading family members...</p></div>}

      {error && <div className="container py-4"><div className="alert alert-danger" role="alert">{error}</div></div>}

      {!loading && !error && !selected && !query && (
        <div className={styles.allGrid}>
          <h2 className={styles.gridTitle}>{SABAI_JANA} <span className="preeti" >({engToNepNumber(members.length)})</span></h2>
          <div className={styles.grid}>
            {members.map((m) => (
              <MemberCard key={m.id} member={m} parents={getParentNames(members, m.parents)} onClick={() => handleClick(m)} />
            ))}
          </div>
        </div>
      )}

      {selected && (
        <div className={`${styles.profileCard} animate-fade`}>
          <button className={styles.closeBtn} onClick={handleClear} aria-label="Close profile">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <div className={styles.profileHeader}>
            <MemberAvatar member={selected} size={80} highlight />
            <div>
              <h2 className={styles.profileName}>{selected.name}</h2>

              {selected.currentAddress && <p className={styles.profileMeta}>{selected.currentAddress}</p>}
              {selected.dod && <span className={styles.badge}>{MRITU_BHAISAKEKO}</span>}
              {selected.gender && <span className={styles.badge}> {selected.gender == "1" ? PURUS : MAHILA} </span>}
            </div>
          </div>

          <div className={styles.profileGrid}>
            {selected.dob && <Section title={JANMA_MITI}>
              {formatDate(selected.dob)} ({UMER} {getAge(selected.dob, selected.dod)})
            </Section>}
            {selected.dod && <Section title={SWARGARAN_MITI}>{formatDate(selected.dod)}</Section>}
            {selected.birthPlace && <Section title={JANMA_STHAN}>{selected.birthPlace}</Section>}
            {parents.length > 0 && (
              <Section title={AAMA_BUBA}>{parents.map((c) => c.name).join(", ")}</Section>
            )}
            {spouse.length > 0 && (<Section title={PATI_PATNI}>{spouse.map((c) => c.name).join(", ")}</Section>)}
            {children.length > 0 && (
              <Section title={BAAL_BACHCHA}>{children.map((c) => c.name).join(", ")}</Section>
            )}

          </div>

          <button className={styles.treeBtn} onClick={() => navigate(`/tree/${selected.id}`)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M4 6l4-4 4 4M4 14h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {selected.name.split(" ")[0]}{KO_PARIWARIK_BIBARAN}
          </button>
        </div>
      )}
    </div>
  );
}

function Section({ title, children, capitalize = false, full = false }: { title: string; children: React.ReactNode; capitalize?: boolean; full?: boolean }) {
  return (
    <div className={`${styles.section} ${full ? styles.fullWidth : ""}`}>
      <dt className={styles.dt}>{title}</dt>
      <dd className={`${styles.dd} ${capitalize ? styles.cap : ""}`}>{children}</dd>
    </div>
  );
}

function MemberCard({ member, parents, onClick }: { member: Member; parents: string[]; onClick: () => void }) {
  return (
    <button className={styles.memberCard} onClick={onClick}>
      <MemberAvatar member={member} size={44} />
      <div className={styles.cardInfo}>
        <span className={styles.cardName}>{member.name}</span>
        <span className={styles.cardMeta}>
          {member.dob ? member.dob.split("-")[0] : ""}
        </span>
        {parents.length > 0 && (
          <span className={styles.cardParents}>↳ {parents.join(" & ")}</span>
        )}
      </div>
    </button>
  );
}
