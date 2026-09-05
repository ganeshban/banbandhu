import type { Member, MemberId } from "../model/Member";
export { formatDate, getAge, getYearsSince, parseLocalDate } from "./dateUtils";

export interface FamilyIndex {
    membersById: Map<string, Member>;
    parentIdsByMemberId: Map<string, string[]>;
    childIdsByMemberId: Map<string, string[]>;
    spouseIdsByMemberId: Map<string, string[]>;
    rootIds: string[];
}

export interface TreeResult {
    roots: Member[];
    memberMap: Record<string, Member>;
}

export interface FocusedTreeResult extends TreeResult {
    focusId: string | number;
    ancestorIds: Set<string>;
    descendantIds: Set<string>;
}

function relationId(value: unknown): string | null {
    if (typeof value === "object" && value !== null && "id" in value) {
        const id = (value as { id?: MemberId }).id;
        return id === undefined || id === null ? null : String(id);
    }

    if (typeof value === "string" || typeof value === "number") {
        return String(value);
    }

    return null;
}

function relationIds(values: unknown): string[] {
    if (!Array.isArray(values)) return [];
    return values.map(relationId).filter((id): id is string => id !== null);
}

function unique(values: string[]): string[] {
    return [...new Set(values)];
}

function isRootMember(member: Member): boolean {
    return member.root === true || member.root === 1 || member.root === "1";
}

export function normalizeMembers(members: Member[] = []): Member[] {
    return members.map((member) => ({
        ...member,
        root: isRootMember(member),
        parents: relationIds(member.parents),
        spouse: relationIds(member.spouse ?? member.spouseIds),
        children: relationIds(member.children),
    }));
}

export function createFamilyIndex(members: Member[] = []): FamilyIndex {
    const normalized = normalizeMembers(members);
    const membersById = new Map(normalized.map((member) => [String(member.id), member]));
    const parentIdsByMemberId = new Map<string, string[]>();
    const childIdsByMemberId = new Map<string, string[]>();
    const spouseIdsByMemberId = new Map<string, string[]>();

    normalized.forEach((member) => {
        const memberId = String(member.id);
        const parentIds = relationIds(member.parents);
        const childIds = relationIds(member.children);
        const spouseIds = relationIds(member.spouse ?? member.spouseIds);

        parentIdsByMemberId.set(memberId, parentIds);
        childIdsByMemberId.set(memberId, childIds);
        spouseIdsByMemberId.set(memberId, spouseIds);

        childIds.forEach((childId) => {
            const existingParents = parentIdsByMemberId.get(childId) ?? [];
            parentIdsByMemberId.set(childId, unique([...existingParents, memberId]));
        });
    });

    normalized.forEach((member) => {
        const memberId = String(member.id);
        (parentIdsByMemberId.get(memberId) ?? []).forEach((parentId) => {
            const existingChildren = childIdsByMemberId.get(parentId) ?? [];
            childIdsByMemberId.set(parentId, unique([...existingChildren, memberId]));
        });

        (spouseIdsByMemberId.get(memberId) ?? []).forEach((spouseId) => {
            const existingSpouses = spouseIdsByMemberId.get(spouseId) ?? [];
            spouseIdsByMemberId.set(spouseId, unique([...existingSpouses, memberId]));
        });
    });

    return {
        membersById,
        parentIdsByMemberId,
        childIdsByMemberId,
        spouseIdsByMemberId,
        rootIds: normalized.filter(isRootMember).map((member) => String(member.id)),
    };
}

function memberFromIndex(index: FamilyIndex, id: string): Member | null {
    return index.membersById.get(id) ?? null;
}

function relationMembers(index: FamilyIndex, ids: string[]): Member[] {
    return ids.map((id) => memberFromIndex(index, id)).filter((member): member is Member => member !== null);
}

function buildNode(index: FamilyIndex, id: string, path = new Set<string>()): Member | null {
    const member = memberFromIndex(index, id);
    if (!member) return null;
    if (path.has(id)) return { ...member, children: [] };

    const nextPath = new Set(path).add(id);
    const children = (index.childIdsByMemberId.get(id) ?? [])
        .map((childId) => buildNode(index, childId, nextPath))
        .filter((child): child is Member => child !== null);

    return { ...member, children };
}

function createIndexOrReuse(membersOrIndex: Member[] | FamilyIndex): FamilyIndex {
    return Array.isArray(membersOrIndex) ? createFamilyIndex(membersOrIndex) : membersOrIndex;
}

export function buildMemberMap(members: Member[] | FamilyIndex = []): Record<string, Member> {
    const index = createIndexOrReuse(members);
    return Object.fromEntries(index.membersById.entries());
}

export function getRelationsForMember(membersOrIndex: Member[] | FamilyIndex = [], memberId: MemberId) {
    const index = createIndexOrReuse(membersOrIndex);
    const id = String(memberId);
    return {
        parents: relationMembers(index, index.parentIdsByMemberId.get(id) ?? []),
        spouses: relationMembers(index, index.spouseIdsByMemberId.get(id) ?? []),
        children: relationMembers(index, index.childIdsByMemberId.get(id) ?? []),
    };
}

export function buildTree(membersOrIndex: Member[] | FamilyIndex, rootId: MemberId | null = null): TreeResult {
    const index = createIndexOrReuse(membersOrIndex);
    const rootIds = rootId === null
        ? index.rootIds
        : index.rootIds.filter((id) => id === String(rootId));
    const roots = rootIds.map((id) => buildNode(index, id)).filter((member): member is Member => member !== null);

    return { roots, memberMap: buildMemberMap(index) };
}

export function buildFocusedTree(membersOrIndex: Member[] | FamilyIndex, focusId: MemberId): FocusedTreeResult {
    const index = createIndexOrReuse(membersOrIndex);
    const focusKey = String(focusId);
    if (!index.membersById.has(focusKey)) {
        return { roots: [], memberMap: {}, focusId, ancestorIds: new Set(), descendantIds: new Set() };
    }

    const ancestorIds = new Set<string>();
    const collectAncestors = (id: string) => {
        (index.parentIdsByMemberId.get(id) ?? []).forEach((parentId) => {
            if (!ancestorIds.has(parentId)) {
                ancestorIds.add(parentId);
                collectAncestors(parentId);
            }
        });
    };
    collectAncestors(focusKey);

    const descendantIds = new Set<string>();
    const collectDescendants = (id: string) => {
        (index.childIdsByMemberId.get(id) ?? []).forEach((childId) => {
            if (!descendantIds.has(childId)) {
                descendantIds.add(childId);
                collectDescendants(childId);
            }
        });
    };
    collectDescendants(focusKey);

    const relevantIds = new Set([focusKey, ...ancestorIds, ...descendantIds]);
    const filteredIndex: FamilyIndex = {
        ...index,
        membersById: new Map([...index.membersById].filter(([id]) => relevantIds.has(id))),
        parentIdsByMemberId: new Map([...index.parentIdsByMemberId].map(([id, ids]) => [id, ids.filter((value) => relevantIds.has(value))])),
        childIdsByMemberId: new Map([...index.childIdsByMemberId].map(([id, ids]) => [id, ids.filter((value) => relevantIds.has(value))])),
        spouseIdsByMemberId: index.spouseIdsByMemberId,
        rootIds: index.rootIds.filter((id) => relevantIds.has(id)),
    };

    const roots = filteredIndex.rootIds
        .map((id) => buildNode(filteredIndex, id))
        .filter((member): member is Member => member !== null);

    return {
        roots,
        memberMap: buildMemberMap(filteredIndex),
        focusId,
        ancestorIds,
        descendantIds,
    };
}

export function getMemberById(membersOrIndex: Member[] | FamilyIndex, id: MemberId): Member | null {
    const index = createIndexOrReuse(membersOrIndex);
    return memberFromIndex(index, String(id));
}

export function getParentNames(membersOrIndex: Member[] | FamilyIndex, parents: unknown): string[] {
    const index = createIndexOrReuse(membersOrIndex);
    return relationIds(parents)
        .map((id) => memberFromIndex(index, id)?.name)
        .filter((name): name is string => Boolean(name));
}

export function engToNepNumber(n: number): string {
    const map: Record<string, string> = {
        "0": ")", "1": "!", "2": "@", "3": "#", "4": "$",
        "5": "%", "6": "^", "7": "&", "8": "*", "9": "(",
    };

    return String(n).split("").map((digit) => map[digit] ?? "").join("");
}
