import { useState, useMemo } from "react";
import familyData from "../data/familyData.json";
import { buildTree, buildFocusedTree, getMemberById, getParentNames } from "../utils/treeUtils";

export function useFamily() {
  const members = familyData.members;

  const { roots, memberMap } = useMemo(() => buildTree(members), []);

  function getFocusedTree(id) {
    return buildFocusedTree(members, id);
  }

  function search(query) {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return members.filter((m) => {
      const parentNames = getParentNames(members, m.parentIds).join(" ").toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        (m.dob && m.dob.includes(q)) ||
        (m.occupation && m.occupation.toLowerCase().includes(q)) ||
        (m.birthPlace && m.birthPlace.toLowerCase().includes(q)) ||
        parentNames.includes(q)
      );
    });
  }

  function getMember(id) {
    return getMemberById(members, id);
  }

  function getSpouse(id) {
    const m = getMember(id);
    return (m?.spouseIds || []).map((id) => getMember(id)).filter(Boolean);

  }

  function getParents(id) {
    const m = getMember(id);
    return (m?.parentIds || []).map((pid) => getMember(pid)).filter(Boolean);
  }

  function getChildren(id) {
    return members.filter((m) => (m.parentIds || []).includes(id));
  }

  return {
    members,
    roots,
    memberMap,
    getFocusedTree,
    search,
    getMember,
    getSpouse,
    getParents,
    getChildren,
  };
}
