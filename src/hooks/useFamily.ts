import { useMemo } from "react";
import type { Member } from "../model/Member";
import { buildTree, buildFocusedTree, getMemberById, getParentNames, getRelationsForMember } from "../utils/treeUtils";
import useMembers from "./userMembers";

export function useFamily() {
  const rawMembers = useMembers();
  const members: Member[] = Array.isArray(rawMembers) ? rawMembers : [];

  const { roots, memberMap } = useMemo(() => buildTree(members), [members]);

  function getFocusedTree(id: string | number) {
    return buildFocusedTree(members, id);
  }

  function search(query: string): Member[] {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return members.filter((m) => {
      const parentNames = getParentNames(members, m.parents ?? m.parentIds).join(" ").toLowerCase();
      return (
        (m.name || "").toLowerCase().includes(q) ||
        (m.dob && m.dob.includes(q)) ||
        (m.birthPlace && m.birthPlace.toLowerCase().includes(q)) ||
        parentNames.includes(q)
      );
    });
  }

  function getMember(id: string | number) {
    return getMemberById(members, id);
  }

  function getSpouse(id: string | number) {
    return getRelationsForMember(members, id).spouses ?? [];
  }

  function getParents(id: string | number) {
    return getRelationsForMember(members, id).parents;
  }

  function getChildren(id: string | number) {
    return getRelationsForMember(members, id).children;
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
