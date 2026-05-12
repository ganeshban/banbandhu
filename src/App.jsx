import React, { useState } from "react";
import Header from "./components/Header";
import TreeView from "./pages/TreeView";
import LookupView from "./pages/LookupView";
import "./styles/global.css";

export default function App() {
  const [tab, setTab] = useState("tree");   // "tree" | "lookup"
  const [focusId, setFocusId] = useState(null);

  function handleViewTree(memberId) {
    setFocusId(memberId);
    setTab("tree");
  }

  function handleTabChange(newTab) {
    setTab(newTab);
    if (newTab === "tree") setFocusId(null);
  }

  return (
    <>
      <Header
        activeTab={tab}
        onTabChange={handleTabChange}
        familyName="वन बन्दु समाज नेपाल"
      />

      {tab === "tree" && (
        <TreeView
          key={focusId}                     // remount when focus changes
          focusId={focusId}
          onBack={focusId ? () => { setFocusId(null); } : null}
        />
      )}

      {tab === "lookup" && (
        <LookupView onViewTree={handleViewTree} />
      )}
    </>
  );
}
