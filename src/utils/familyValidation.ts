/** @typedef {import("../model/Member").Member} Member */

function isValidIsoDate(value) {
    if (!value || value === null) return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}

/** @param {Member[] | null | undefined} members */
export function validateFamilyData(members = []) {
    const issues = [];
    const seenIds = new Set();
    const allIds = new Set((members || []).map((member) => member?.id).filter(Boolean));

    members.forEach((member, index) => {
        const id = member?.id;

        if (!id) {
            issues.push(`Member at index ${index} is missing an id.`);
            return;
        }

        if (seenIds.has(String(id))) {
            issues.push(`Duplicate member id: ${id}`);
        }
        seenIds.add(String(id));

        if (member.name === undefined || !String(member.name).trim()) {
            issues.push(`Member ${id} is missing a name.`);
        }

        if (member.dob && !isValidIsoDate(member.dob)) {
            issues.push(`Invalid DOB for member ${id}: ${member.dob}`);
        }

        if (member.dod && !isValidIsoDate(member.dod)) {
            issues.push(`Invalid DOD for member ${id}: ${member.dod}`);
        }

        if (member.dob && member.dod && isValidIsoDate(member.dob) && isValidIsoDate(member.dod)) {
            const dobDate = new Date(member.dob);
            const dodDate = new Date(member.dod);
            if (dodDate.getTime() < dobDate.getTime()) {
                issues.push(`DOD is earlier than DOB for member ${id}.`);
            }
        }

        const parentIds = Array.isArray(member.parents) ? member.parents : (Array.isArray(member.parentIds) ? member.parentIds : []);
        parentIds.forEach((parentId) => {
            if (!allIds.has(String(parentId))) {
                issues.push(`Missing parent reference for member ${id}: ${parentId}`);
            }
        });

        const spouseIds = Array.isArray(member.spouse) ? member.spouse : (Array.isArray(member.spouseIds) ? member.spouseIds : []);
        spouseIds.forEach((spouseId) => {
            if (!allIds.has(String(spouseId))) {
                issues.push(`Missing spouse reference for member ${id}: ${spouseId}`);
            }
        });
    });

    return {
        isValid: issues.length === 0,
        issues,
        totalMembers: members.length,
    };
}

/** @param {Member[] | null | undefined} members */
export function getFamilyDataSummary(members = []) {
    const valid = validateFamilyData(members);

    return {
        total: members.length,
        valid: valid.isValid,
        issueCount: valid.issues.length,
        rootMembers: members.filter((member) => {
            const parentIds = Array.isArray(member.parents) ? member.parents : (Array.isArray(member.parentIds) ? member.parentIds : []);
            return parentIds.length === 0;
        }).length,
    };
}
