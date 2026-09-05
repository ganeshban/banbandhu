interface ValidationMember {
    id?: string | number | null;
    name?: unknown;
    dob?: unknown;
    dod?: unknown;
    parents?: unknown;
    parentIds?: unknown;
    spouse?: unknown;
    spouseIds?: unknown;
    children?: unknown;
    root?: unknown;
}

function isValidIsoDate(value: unknown): boolean {
    if (!value) return true;
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year
        && date.getMonth() === month - 1
        && date.getDate() === day;
}

function relationIds(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value
        .map((relation) => {
            if (typeof relation === "object" && relation !== null && "id" in relation) {
                return String((relation as { id: string | number }).id);
            }
            return typeof relation === "string" || typeof relation === "number" ? String(relation) : null;
        })
        .filter((id): id is string => id !== null);
}

function asMembers(members: unknown[]): ValidationMember[] {
    return members.filter((member): member is ValidationMember => Boolean(member && typeof member === "object"));
}

export function validateFamilyData(input: unknown[] = []) {
    const members = asMembers(input);
    const issues: string[] = [];
    const seenIds = new Set<string>();
    const allIds = new Set(members.map((member) => member.id).filter((id) => id !== null && id !== undefined).map(String));

    members.forEach((member, index) => {
        const id = member.id;
        if (id === null || id === undefined || id === "") {
            issues.push(`Member at index ${index} is missing an id.`);
            return;
        }

        const key = String(id);
        if (seenIds.has(key)) issues.push(`Duplicate member id: ${id}`);
        seenIds.add(key);

        if (typeof member.name !== "string" || !member.name.trim()) {
            issues.push(`Member ${id} is missing a name.`);
        }

        if (member.dob && !isValidIsoDate(member.dob)) {
            issues.push(`Invalid DOB for member ${id}: ${String(member.dob)}`);
        }
        if (member.dod && !isValidIsoDate(member.dod)) {
            issues.push(`Invalid DOD for member ${id}: ${String(member.dod)}`);
        }

        if (isValidIsoDate(member.dob) && isValidIsoDate(member.dod) && member.dob && member.dod) {
            if (new Date(String(member.dod)).getTime() < new Date(String(member.dob)).getTime()) {
                issues.push(`DOD is earlier than DOB for member ${id}.`);
            }
        }

        const parents = relationIds(member.parents ?? member.parentIds);
        parents.forEach((parentId) => {
            if (!allIds.has(parentId)) issues.push(`Missing parent reference for member ${id}: ${parentId}`);
        });

        const spouses = relationIds(member.spouse ?? member.spouseIds);
        spouses.forEach((spouseId) => {
            if (!allIds.has(spouseId)) issues.push(`Missing spouse reference for member ${id}: ${spouseId}`);
        });

        const children = relationIds(member.children);
        children.forEach((childId) => {
            if (!allIds.has(childId)) issues.push(`Missing child reference for member ${id}: ${childId}`);
        });
    });

    return {
        isValid: issues.length === 0,
        issues,
        totalMembers: members.length,
    };
}

export function getFamilyDataSummary(input: unknown[] = []) {
    const members = asMembers(input);
    const validation = validateFamilyData(input);

    return {
        total: members.length,
        valid: validation.isValid,
        issueCount: validation.issues.length,
        rootMembers: members.filter((member) => member.root === true || member.root === 1 || member.root === "1").length,
    };
}
