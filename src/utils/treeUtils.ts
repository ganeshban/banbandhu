function normalizeArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function isRootMember(member) {
  if (member?.root === true || member?.root === 1 || member?.root === "1") return true;
  if (member?.root === false || member?.root === 0 || member?.root === "0") return false;
  return false;
}

export function normalizeMembers(members = []) {
  return (members || []).map((member) => ({
    ...member,
    root: isRootMember(member),
    parents: normalizeArray(member?.parents ?? member?.parentIds),
    spouse: normalizeArray(member?.spouse ?? member?.spouseIds),
    children: normalizeArray(member?.children),
  }));
}

export function buildMemberMap(members = []) {
  return normalizeMembers(members);
}

export function getRelationsForMember(members = [], memberId) {
  const memberMap = buildMemberMap(members);
  const member = memberMap.find((entry) => String(entry.id) === String(memberId));

  if (!member) {
    return { parents: [], spouses: [], children: [] };
  }

  const parents = normalizeArray(member.parents || member.parentIds)
    .map((id) => memberMap.find((entry) => String(entry.id) === String(id)))
    .filter(Boolean);
  const spouses = normalizeArray(member.spouse || member.spouseIds)
    .map((id) => memberMap.find((entry) => String(entry.id) === String(id)))
    .filter(Boolean);
  const children = normalizeMembers(members).filter((candidate) =>
    normalizeArray(candidate.parents || candidate.parentIds).some((parentId) => String(parentId) === String(memberId))
  );
  return { parents, spouses, children };
}

export function buildTree(members, rootId = null) {
  const normalized = normalizeMembers(members);
  const memberMap = buildMemberMap(normalized);
  const roots = [];

  normalized.forEach((member) => {
    const isExplicitRoot = isRootMember(member);
    const hasParent = normalizeArray(member.parents || member.parentIds).some((parentId) =>
      memberMap.some((entry) => String(entry.id) === String(parentId))
    );
    const matchesRootId = rootId === null ? true : String(member.id) === String(rootId);

    if ((isExplicitRoot || (!hasParent && matchesRootId)) && (rootId === null || String(member.id) === String(rootId) || isExplicitRoot)) {
      roots.push(member);
    }
  });

  if (rootId === null && roots.length === 0) {
    normalized.forEach((member) => {
      const hasParent = normalizeArray(member.parents || member.parentIds).some((parentId) =>
        memberMap.some((entry) => String(entry.id) === String(parentId))
      );
      if (!hasParent) {
        roots.push(member);
      }
    });
  }

  return { roots, memberMap };
}

/** @param {Member[] | null | undefined} members @param {string | number} focusId */
export function buildFocusedTree(members, focusId) {
  const normalized = normalizeMembers(members);
  const memberMap = new Map(normalized.map((member) => [String(member.id), member]));
  const focus = memberMap.get(String(focusId));

  if (!focus) return { roots: [], memberMap: {}, focusId, ancestorIds: new Set(), descendantIds: new Set() };

  const ancestorIds = new Set();
  function collectAncestors(id) {
    const member = memberMap.get(String(id));
    if (!member) return;

    normalizeArray(member.parents || member.parentIds).forEach((parentId) => {
      if (!ancestorIds.has(String(parentId))) {
        ancestorIds.add(String(parentId));
        collectAncestors(parentId);
      }
    });
  }
  collectAncestors(focusId);

  const descendantIds = new Set();
  function collectDescendants(id) {
    normalized.forEach((member) => {
      const parentIds = normalizeArray(member.parents || member.parentIds).map(String);
      if (parentIds.includes(String(id)) && !descendantIds.has(String(member.id))) {
        descendantIds.add(String(member.id));
        collectDescendants(member.id);
      }
    });
  }
  collectDescendants(focusId);

  const relevantIds = new Set([...ancestorIds, String(focusId), ...descendantIds]);
  const filteredMap = {};

  relevantIds.forEach((id) => {
    const member = memberMap.get(id);
    if (member) {
      filteredMap[id] = { ...member, children: [] };
    }
  });

  relevantIds.forEach((id) => {
    const member = filteredMap[id];
    if (!member) return;

    normalizeArray(member.parents || member.parentIds).forEach((parentId) => {
      const parentKey = String(parentId);
      if (filteredMap[parentKey] && !filteredMap[parentKey].children.some((child) => child.id === member.id)) {
        filteredMap[parentKey].children.push(filteredMap[id]);
      }
    });
  });

  const roots = [];
  relevantIds.forEach((id) => {
    const member = filteredMap[id];
    if (!member) return;
    const hasParentInSet = normalizeArray(member.parents || member.parentIds).some((parentId) => relevantIds.has(String(parentId)));
    if (!hasParentInSet) roots.push(member);
  });

  return { roots, memberMap: filteredMap, focusId, ancestorIds, descendantIds };
}

/** @param {string | null | undefined} dateStr */
export function parseLocalDate(dateStr) {
  if (!dateStr) return null;

  const isoMatch = /^\d{4}-\d{2}-\d{2}$/.exec(dateStr);
  if (isoMatch) {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** @param {string | null | undefined} dateStr */
export function formatDate(dateStr) {
  if (!dateStr) return "Present";
  const d = parseLocalDate(dateStr);
  if (!d || Number.isNaN(d.getTime())) return "Unknown";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/** @param {string | null | undefined} dob @param {string | null | undefined} dod */
export function getAge(dob, dod) {
  const end = dod ? parseLocalDate(dod) : new Date();
  const start = parseLocalDate(dob);
  if (!start || Number.isNaN(start.getTime()) || !end || Number.isNaN(end.getTime())) return 0;
  return Math.floor((end - start) / (365.25 * 24 * 60 * 60 * 1000));
}

/** @param {string | null | undefined} dateStr */
export function getYearsSince(dateStr) {
  return getAge(dateStr, null);
}

/** @param {Member[] | null | undefined} members @param {string | number | null} id */
export function getMemberById(members, id) {
  if (id === null || id === undefined) return null;
  return normalizeMembers(members).find((member) => String(member.id) === String(id)) || null;
}

/** @param {Member[] | null | undefined} members @param {Array<string | number> | undefined} parents */
export function getParentNames(members, parents) {
  return normalizeArray(parents)
    .map((id) => getMemberById(members, id)?.name)
    .filter(Boolean);
}

export function engToNepNumber(n) {
  const map = {
    0: ")",
    1: "!",
    2: "@",
    3: "#",
    4: "$",
    5: "%",
    6: "^",
    7: "&",
    8: "*",
    9: "(",
  };

  return n.toString()
    .split("")
    .map((digit) => map[digit] || "")
    .join("");
}

