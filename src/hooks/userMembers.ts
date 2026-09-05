
import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from "react";
import type { Member } from "../model/Member";

export interface MembersState {
    members: Member[];
    loading: boolean;
    error: string | null;
}

const MembersContext = createContext<MembersState | null>(null);
let membersRequest: Promise<Member[]> | null = null;

function normalizeMembersPayload(payload: unknown): Member[] {
    if (Array.isArray(payload)) {
        return payload as Member[];
    }

    if (payload && typeof payload === "object") {
        const record = payload as Record<string, unknown>;

        const candidates = [
            record.data,
            record.members,
            record.result,
        ];

        for (const candidate of candidates) {
            if (Array.isArray(candidate)) {
                return candidate as Member[];
            }
        }
    }

    return [];
}

function fetchMembers(): Promise<Member[]> {
    if (membersRequest) return membersRequest;

    const supabaseUrl = (import.meta.env as Record<string, string | undefined>).VITE_SUPABASE_URL ?? "https://axxplyuhlgrqbvwpulio.supabase.co";
    const anonKey = (import.meta.env as Record<string, string | undefined>).VITE_SUPABASE_CLIENT_ANON_KEY;

    if (!anonKey) {
        return Promise.reject(new Error("VITE_SUPABASE_CLIENT_ANON_KEY is missing."));
    }

    membersRequest = fetch(`${supabaseUrl}/rest/v1/rpc/getmembers`, {
        method: "GET",
        headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Supabase RPC failed: ${response.status}`);
            }
            return response.json();
        })
        .then(normalizeMembersPayload);

    return membersRequest;
}

export function MembersProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<MembersState>({ members: [], loading: true, error: null });

    useEffect(() => {
        let ignore = false;
        fetchMembers()
            .then((members) => {
                if (!ignore) {
                    setState({ members, loading: false, error: null });
                }
            })
            .catch((error) => {
                if (!ignore) {
                    setState({
                        members: [],
                        loading: false,
                        error: error instanceof Error ? error.message : "Supabase family data could not be loaded.",
                    });
                }
            });

        return () => {
            ignore = true;
        };
    }, []);

    return createElement(MembersContext.Provider, { value: state }, children);
}

export default function useMembers(): MembersState {
    const state = useContext(MembersContext);
    if (!state) {
        throw new Error("useMembers must be used inside MembersProvider.");
    }
    return state;
}