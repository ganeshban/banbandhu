import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { MemberId } from "../model/Member";
import TreeNode from "../components/TreeNode";
import MemberPanel from "../components/MemberPanel";
import styles from "./TreeView.module.css";
import { buildFocusedTree, getRelationsForMember } from "../utils/treeUtils";
import { useFamily } from "../hooks/useFamily";
import { DEKHAIYAKO, MAHILA, MRITU_BHAISAKEKO, PUNA_KHOJNUHOS, PURUS } from "../utils/Constants";

export default function TreeView() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const initialFocusId: MemberId | null = userId ?? null;
  const [focusId, setFocusId] = useState(initialFocusId);
  const [selectedMember, setSelectedMember] = useState(null);

  const { members, familyIndex, loading, error, roots: fullRoots } = useFamily();
  useEffect(() => {
    const member = userId ? members.find((entry) => String(entry.id) === userId) ?? null : null;
    setFocusId(userId ?? null);
    setSelectedMember(member);
  }, [members, userId]);
  const roots = useMemo(
    () => (focusId ? buildFocusedTree(familyIndex, focusId).roots : fullRoots),
    [focusId, familyIndex, fullRoots]
  );

  const relationState = useMemo(
    () => selectedMember
      ? getRelationsForMember(familyIndex, selectedMember.id)
      : { parents: [], spouses: [], children: [] },
    [familyIndex, selectedMember]
  );

  const parents = relationState.parents;
  const spouses = relationState.spouses;
  const children = relationState.children;

  function handleSelect(node) {
    // Find full member (node may be a clone from tree)
    const full = members.find((m) => String(m.id) === String(node.id));
    setSelectedMember(full || node);
  }

  function handleNavigate(id) {
    setFocusId(id);
    navigate(`/tree/${id}`);
    const m = members.find((m) => String(m.id) === String(id));
    setSelectedMember(m || null);
  }

  function clearFocus() {
    setFocusId(null);
    setSelectedMember(null);
    navigate("/tree");
  }

  return (
    <div className={`${styles.layout} container-fluid p-0`}>
      {/* Main tree canvas */}
      <div className={`${styles.canvas} col p-0`}>
        <div className={`${styles.toolbar} d-flex flex-wrap align-items-center`}>
          {focusId && (
            <button className={styles.backBtn} onClick={() => navigate("/tree")}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L3 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {PUNA_KHOJNUHOS}
            </button>
          )}

          {focusId && (
            <div className={styles.focusChip}>
              <span> {DEKHAIYAKO}:</span>
              <strong>{members.find((m) => String(m.id) === String(focusId))?.name}</strong>
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
            {loading ? (
              <p className={styles.empty}>Loading family members...</p>
            ) : error ? (
              <p className={styles.empty}>{error}</p>
            ) : roots.length === 0 ? (
              <p className={styles.empty}>कुनै सदस्य पनि फेला परेनन् ।</p>
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
        <>
          <div className="d-none d-md-block">
            <MemberPanel
              member={selectedMember}
              parents={parents}
              spouses={spouses}
              children={children}
              onClose={() => setSelectedMember(null)}
              onNavigate={handleNavigate}
            />
          </div>

          <div className={`${styles.mobileOverlay} d-block d-md-none`}>
            <div className={`${styles.mobileModal} modal fade show d-block`} tabIndex={-1} role="dialog" aria-modal="true">
              <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className={`${styles.mobileModalContent} modal-content`}>
                  <MemberPanel
                    member={selectedMember}
                    parents={parents}
                    spouses={spouses}
                    children={children}
                    onClose={() => setSelectedMember(null)}
                    onNavigate={handleNavigate}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
