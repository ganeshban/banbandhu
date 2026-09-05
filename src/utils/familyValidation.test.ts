import { describe, expect, it } from "vitest";
import { validateFamilyData } from './familyValidation';

describe("validateFamilyData", () => {
    it('catches duplicate ids and invalid date values', () => {
        const members = [
            {
                id: '1',
                name: 'Parent',
                dob: '1990-01-01',
                dod: null,
                gender: 'पुरूष',
                parents: [],
                spouse: ['2'],
            },
            {
                id: '1',
                name: 'Duplicate',
                dob: 'bad-date',
                dod: null,
                gender: 'महिला',
                parents: [],
                spouse: [],
            },
            {
                id: '3',
                name: 'Orphan child',
                dob: '2000-02-02',
                dod: null,
                gender: 'पुरूष',
                parentIds: ['999'],
                spouseIds: [],
            },
        ];

        const result = validateFamilyData(members);

        expect(result.isValid).toBe(false);
        expect(result.issues.some((issue) => issue.includes('Duplicate member id'))).toBe(true);
        expect(result.issues.some((issue) => issue.includes('Missing parent reference'))).toBe(true);
        expect(result.issues.some((issue) => issue.includes('Invalid DOB'))).toBe(true);
    });

    it('accepts a clean member list', () => {
        const members = [
            {
                id: '10',
                name: 'Grand Parent',
                dob: '1940-01-01',
                dod: '2000-01-01',
                gender: 'पुरूष',
                parentIds: [],
                spouseIds: ['11'],
            },
            {
                id: '11',
                name: 'Grand Parent Spouse',
                dob: '1945-02-02',
                dod: null,
                gender: 'महिला',
                parentIds: [],
                spouseIds: ['10'],
            },
            {
                id: '12',
                name: 'Child',
                dob: '1970-03-03',
                dod: null,
                gender: 'पुरूष',
                parentIds: ['10'],
                spouseIds: [],
            },
        ];

        const result = validateFamilyData(members);

        expect(result.isValid).toBe(true);
        expect(result.issues).toHaveLength(0);
    });
});
