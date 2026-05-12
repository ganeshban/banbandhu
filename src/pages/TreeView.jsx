import React, { useState, useCallback } from "react";
import TreeNode from "../components/TreeNode";
import MemberPanel from "../components/MemberPanel";
import styles from "./TreeView.module.css";
import { buildFocusedTree, buildTree } from "../utils/treeUtils";
import familyData from "../data/familyData.json";
import { DEKHAIYAKO, MAHILA, MRITU_BHAISAKEKO, PUNA_KHOJNUHOS, PURUS } from "../utils/Constants";

const members = familyData.members;

export default function TreeView({ focusId: initialFocusId = null, onBack }) {
  const [focusId, setFocusId] = useState(initialFocusId);
  const [selectedMember, setSelectedMember] = useState(null);

  const { roots } = focusId
    ? buildFocusedTree(members, focusId)
    : buildTree(members);

  // Derive relations for panel
  const parents = selectedMember
    ? (selectedMember.parentIds || []).map((id) => members.find((m) => m.id === id)).filter(Boolean)
    : [];
  const spouse = selectedMember
    ? (selectedMember.spouseIds || []).map((id) => members.find((m) => m.id === id)).filter(Boolean)
    : [];
  const children = selectedMember
    ? members.filter((m) => (m.parentIds || []).includes(selectedMember.id))
    : [];

  function handleSelect(node) {
    // Find full member (node may be a clone from tree)
    const full = members.find((m) => m.id === node.id);
    setSelectedMember(full || node);
  }

  function handleNavigate(id) {
    setFocusId(id);
    const m = members.find((m) => m.id === id);
    setSelectedMember(m || null);
  }

  function clearFocus() {
    setFocusId(null);
  }

  return (
    <div className={styles.layout}>
      {/* Main tree canvas */}
      <div className={styles.canvas}>
        <div className={styles.toolbar}>
          {onBack && (
            <button className={styles.backBtn} onClick={onBack}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L3 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {PUNA_KHOJNUHOS}
            </button>
          )}

          {focusId && (
            <div className={styles.focusChip}>
              <span> {DEKHAIYAKO}:</span>
              <strong>{members.find((m) => m.id === focusId)?.name}</strong>
              <button onClick={clearFocus} title="Show full tree">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          )}

          <div className={styles.legend}>
            <span className={`${styles.legendDot} ${styles.lgMale}`} /> {PURUS}
            <span className={`${styles.legendDot} ${styles.lgFemale}`} /> {MAHILA}
            <span className={styles.legendDecease} /> {MRITU_BHAISAKEKO}
          </div>
        </div>

        <div className={styles.treeScroll}>
          <div className={styles.treeRoot}>
            {roots.length === 0 ? (
              <p className={styles.empty}>No family members to display.</p>
            ) : (
              roots.map((root) => (
                <TreeNode
                  key={root.id}
                  node={root}
                  onSelect={handleSelect}
                  focusId={focusId}
                  depth={0}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {selectedMember && (
        <MemberPanel
          member={selectedMember}
          parents={parents}
          spouses={spouse}
          children={children}
          onClose={() => setSelectedMember(null)}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}
