import { useMemo } from "react";
import type { Member } from "../model/Member";
import { buildTree, buildFocusedTree, createFamilyIndex, getMemberById, getParentNames, getRelationsForMember } from "../utils/treeUtils";
import useMembers from "./userMembers";

export function useFamily() {
  const rawMembers = useMembers();
  const members: Member[] = Array.isArray(rawMembers) ? rawMembers : [];
  const familyIndex = useMemo(() => createFamilyIndex(members), [members]);

  const { roots, memberMap } = useMemo(() => buildTree(familyIndex), [familyIndex]);

  function getFocusedTree(id: string | number) {
    return buildFocusedTree(familyIndex, id);
  }

  function search(query: string): Member[] {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return members.filter((m) => {
      const parentNames = getParentNames(familyIndex, m.parents).join(" ").toLowerCase();
      return (
        (m.name || "").toLowerCase().includes(q) ||
        (m.dob && m.dob.includes(q)) ||
        (m.birthPlace && m.birthPlace.toLowerCase().includes(q)) ||
        parentNames.includes(q)
      );
    });
  }

  function getMember(id: string | number) {
    return getMemberById(familyIndex, id);
  }

  function getSpouse(id: string | number) {
    return getRelationsForMember(familyIndex, id).spouses;
  }

  function getParents(id: string | number) {
    return getRelationsForMember(familyIndex, id).parents;
  }

  function getChildren(id: string | number) {
    return getRelationsForMember(familyIndex, id).children;
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
