export type MemberId = string | number;
export type Gender = 1 | 2 | "1" | "2";

export type RootFlag = boolean | 0 | 1 | "0" | "1";

export interface Member {
    id: MemberId;
    name: string;
    otherName?: string | null;
    phone?: string | null;
    dob?: string | null;
    dod?: string | null;
    root?: RootFlag;
    birthPlace?: string | null;
    gender?: Gender | null;
    photoUrl?: string | null;
    photoURL?: string | null;
    currentAddress?: string | null;
    parents?: MemberId[];
    parentIds?: MemberId[];
    spouse?: MemberId[];
    spouseIds?: MemberId[];
    children?: Member[];
}

export type MemberMap = Record<string, Member>;

export interface FamilyRelationState {
    parents: Member[];
    spouses: Member[];
    children: Member[];
}