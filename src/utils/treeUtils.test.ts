import { describe, expect, it } from "vitest";
import { buildFocusedTree, buildTree, createFamilyIndex, getRelationsForMember } from "./treeUtils";
import type { Member } from "../model/Member";

const members: Member[] = [
    { id: 1, name: "Root", root: 1, children: [2] },
    { id: 2, name: "Child", parents: [1], spouse: [3], children: [4] },
    { id: 3, name: "Spouse", spouse: [2], children: [4] },
    { id: 4, name: "Grandchild", parents: [2, 3] },
    { id: 99, name: "Orphan" },
];

describe("family tree index", () => {
    it("uses explicit roots and excludes orphans", () => {
        const tree = buildTree(createFamilyIndex(members));

        expect(tree.roots.map((member) => member.id)).toEqual([1]);
        expect(tree.roots[0].children?.map((member) => member.id)).toEqual([2]);
    });

    it("builds missing inverse relationships in memory", () => {
        const relations = getRelationsForMember(createFamilyIndex(members), 3);

        expect(relations.spouses.map((member) => member.id)).toEqual([2]);
        expect(relations.children.map((member) => member.id)).toEqual([4]);
    });

    it("keeps unrelated orphans out of focused trees", () => {
        const focused = buildFocusedTree(createFamilyIndex(members), 2);

        expect(focused.roots.map((member) => member.id)).toEqual([1]);
        expect(focused.roots.some((member) => member.id === 99)).toBe(false);
        expect(focused.descendantIds).toEqual(new Set(["4"]));
    });
});
