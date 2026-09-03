import React, { useState, useMemo } from "react";
import Header from "./components/Header";
import TreeView from "./pages/TreeView";
import LookupView from "./pages/LookupView";
import { validateFamilyData } from "./utils/familyValidation";
import "./styles/global.css";
import useMembers from "./hooks/userMembers";

export default function App() {
  const [tab, setTab] = useState<"tree" | "lookup">("tree");
  const [focusId, setFocusId] = useState<string | number | null>(null);
  const member = useMembers();
  const familyValidation = useMemo(() => validateFamilyData(member), [member]);

  if (!familyValidation.isValid) {
    console.warn("Family data validation issues:", familyValidation.issues);
  }

  function handleViewTree(memberId: string | number) {
    setFocusId(memberId);
    setTab("tree");
  }

  function handleTabChange(newTab: "tree" | "lookup") {
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
          key={String(focusId ?? "all")}
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
