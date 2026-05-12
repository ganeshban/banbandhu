import React, { useState } from "react";
import MemberAvatar from "./MemberAvatar";
import styles from "./TreeNode.module.css";

export default function TreeNode({ node, onSelect, focusId, depth = 0 }) {
  const [expanded, setExpanded] = useState(depth < 9);
  const isFocused = focusId === node.id;
  const hasChildren = node.children && node.children.length > 0;
  const isDeceased = !!node.dod;

  return (
    <div className={`${styles.nodeWrapper} animate-fade`} style={{ animationDelay: `${depth * 3}ms` }}>
      <div className={styles.nodeRow}>
        {/* Vertical + horizontal connector lines are handled by CSS */}
        <div
          className={`${styles.card} ${isFocused ? styles.focused : ""} ${isDeceased ? styles.deceased : ""}`}
          onClick={() => onSelect(node)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onSelect(node)}
          aria-label={`View ${node.name}`}
        >
          <MemberAvatar member={node} size={40} highlight={isFocused} />
          <div className={styles.info}>
            <span className={styles.name}>{node.otherName ?? node.name}</span>
            <span className={styles.meta}>
              {node.dob ? node.dob.split("-")[0] : "?"}
              {node.dod ? `-${node.dod.split("-")[0]}` : ""}
            </span>
          </div>
          {hasChildren && (
            <button
              className={styles.toggle}
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((p) => !p);
              }}
              aria-label={expanded ? "Collapse" : "Expand"}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d={expanded ? "M2 7L5 4L8 7" : "M2 3L5 6L8 3"}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {hasChildren && expanded && (
        <div className={styles.children}>
          <div className={styles.branchLine} />
          <div className={styles.childList}>
            {node.children.map((child) => (
              <div key={child.id} className={styles.childBranch}>
                <div className={styles.hLine} />
                <TreeNode
                  node={child}
                  onSelect={onSelect}
                  focusId={focusId}
                  depth={depth + 1}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
