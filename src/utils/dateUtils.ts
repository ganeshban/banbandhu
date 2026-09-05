export function parseLocalDate(dateStr?: string | null): Date | null {
    if (!dateStr) return null;

    const isoMatch = /^\d{4}-\d{2}-\d{2}$/.exec(dateStr);
    if (isoMatch) {
        const [year, month, day] = dateStr.split("-").map(Number);
        return new Date(year, month - 1, day);
    }

    const parsed = new Date(dateStr);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDate(dateStr?: string | null): string {
    if (!dateStr) return "Present";
    const date = parseLocalDate(dateStr);
    if (!date) return "Unknown";

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function getAge(dob?: string | null, dod?: string | null): number {
    const start = parseLocalDate(dob);
    const end = dod ? parseLocalDate(dod) : new Date();
    if (!start || !end) return 0;

    return Math.floor(
        (end.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
    );
}

export function getYearsSince(dateStr?: string | null): number {
    return getAge(dateStr, null);
}
