import { useEffect, useRef, useState } from "react";
import { formatDate } from "../utils/treeUtils";
import MemberAvatar from "./MemberAvatar";
import styles from "./SearchBar.module.css";
import { BHAYAKO_VETIYANA, KHOJNE_Q_TEXT } from "../utils/Constants";

export default function SearchBar({ onSearch, results, onSelect, onClear }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);


  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleChange(e) {
    const val = e.target.value;
    setQuery(val);
    onSearch(val);
    setOpen(val.length > 0);
  }

  function handleSelect(member) {
    setQuery(member.name);
    setOpen(false);
    onSelect(member);
  }

  function handleClear() {
    setQuery("");
    setOpen(false);
    onClear();
  }

  return (
    <div className={styles.wrapper} ref={ref}>
      <div className={`${styles.inputRow} ${open && results.length > 0 ? styles.active : ""}`}>
        <svg className={styles.icon} width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M11.5 11.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <input
          className={styles.input}
          type="text"
          placeholder={KHOJNE_Q_TEXT}
          value={query}
          onChange={handleChange}
          onFocus={() => query && setOpen(true)}
          aria-label="Search family members"
          autoComplete="off"
        />
        {query && (
          <button className={styles.clear} onClick={handleClear} aria-label="Clear search">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <ul className={`${styles.dropdown} animate-scale`} role="listbox">
          {results.map((m) => (
            <li key={m.id} role="option">
              <button className={styles.result} onClick={() => handleSelect(m)}>
                <MemberAvatar member={m} size={36} />
                <div className={styles.resultInfo}>
                  <span className={styles.resultName}>{m.name}</span>
                  <span className={styles.resultMeta}>
                    {m.dob ? formatDate(m.dob) : ""}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && query && results.length === 0 && (
        <div className={`${styles.dropdown} ${styles.empty}`}>
          "{query}" {BHAYAKO_VETIYANA}
        </div>
      )}
    </div>
  );
}
