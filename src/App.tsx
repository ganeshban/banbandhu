import React, { useMemo } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import TreeView from "./pages/TreeView";
import LookupView from "./pages/LookupView";
import { validateFamilyData } from "./utils/familyValidation";
import "./styles/global.css";
import useMembers from "./hooks/userMembers";

export default function App() {
  const member = useMembers();
  const familyValidation = useMemo(() => validateFamilyData(member), [member]);

  if (!familyValidation.isValid) {
    console.warn("Family data validation issues:", familyValidation.issues);
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.startsWith("/list") ? "lookup" : "tree";

  return (
    <>
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => navigate(tab === "lookup" ? "/list" : "/tree")}
        familyName="वन बन्दु समाज नेपाल"
      />
      <Routes>
        <Route path="/list" element={<LookupView />} />
        <Route path="/list/:userId" element={<LookupView />} />
        <Route path="/tree" element={<TreeView />} />
        <Route path="/tree/:userId" element={<TreeView />} />
        <Route path="*" element={<Navigate to="/tree" replace />} />
      </Routes>
    </>
  );
}
