// Build a tree structure from flat member list
export function buildTree(members, rootId = null) {
  const memberMap = {};
  members.forEach((m) => (memberMap[m.id] = { ...m, children: [] }));

  const roots = [];

  members.forEach((member) => {
    if (!member.parentIds || member.parentIds.length === 0) {
      if (rootId === null || member.id === rootId) {
        if (member.spouseIds === null) {
          roots.push(memberMap[member.id]);
        }
      }
    } else {
      // Add child to first biological parent found
      const parentId = member.parentIds[0];
      if (memberMap[parentId]) {
        memberMap[parentId].children.push(memberMap[member.id]);
      }
    }
  });

  return { roots, memberMap };
}

// Build a focused subtree: the member + their ancestors + descendants
export function buildFocusedTree(members, focusId) {
  const memberMap = {};
  members.forEach((m) => (memberMap[m.id] = { ...m, children: [] }));

  const focus = memberMap[focusId];
  if (!focus) return { roots: [], memberMap };

  // Collect all ancestor IDs
  const ancestorIds = new Set();
  function collectAncestors(id) {
    const m = memberMap[id];
    if (!m) return;
    (m.parentIds || []).forEach((pid) => {
      if (!ancestorIds.has(pid)) {
        ancestorIds.add(pid);
        collectAncestors(pid);
      }
    });
  }
  collectAncestors(focusId);

  // Collect all descendant IDs
  const descendantIds = new Set();
  function collectDescendants(id) {
    members.forEach((m) => {
      if ((m.parentIds || []).includes(id) && !descendantIds.has(m.id)) {
        descendantIds.add(m.id);
        collectDescendants(m.id);
      }
    });
  }
  collectDescendants(focusId);

  const relevantIds = new Set([...ancestorIds, focusId, ...descendantIds]);

  // Rebuild children only for relevant members
  const filteredMap = {};
  relevantIds.forEach((id) => {
    filteredMap[id] = { ...memberMap[id], children: [] };
  });

  relevantIds.forEach((id) => {
    const m = filteredMap[id];
    const parentId = (m.parentIds || [])[0];
    if (parentId && filteredMap[parentId]) {
      filteredMap[parentId].children.push(filteredMap[id]);
    }
  });

  // Find roots (no parents in relevant set)
  const roots = [];
  relevantIds.forEach((id) => {
    const m = filteredMap[id];
    const hasParentInSet = (m.parentIds || []).some((pid) => relevantIds.has(pid));
    if (!hasParentInSet) roots.push(filteredMap[id]);
  });

  return { roots, memberMap: filteredMap, focusId, ancestorIds, descendantIds };
}

function parseLocalDate(dateStr) {
  if (!dateStr) return null;

  const isoMatch = /^\d{4}-\d{2}-\d{2}$/.exec(dateStr);
  if (isoMatch) {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(dateStr);
}

export function formatDate(dateStr) {
  if (!dateStr) return "Present";
  const d = parseLocalDate(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function getAge(dob, dod) {
  const end = dod ? parseLocalDate(dod) : new Date();
  const start = parseLocalDate(dob);
  if (!start || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  return Math.floor((end - start) / (365.25 * 24 * 60 * 60 * 1000));
}

export function getYearsSince(dateStr) {
  return getAge(dateStr, null);
}

export function getMemberById(members, id) {
  return members.find((m) => m.id === id) || null;
}

export function getParentNames(members, parentIds) {
  return (parentIds || [])
    .map((id) => getMemberById(members, id)?.name)
    .filter(Boolean);
}
export function engToNepNumber(n) {
  let x = "";
  switch (n) {
    case 1: x = "!";
  }
  return (parentIds || [])
    .map((id) => getMemberById(members, id)?.name)
    .filter(Boolean);
}

