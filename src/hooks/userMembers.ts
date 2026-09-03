
import { useEffect, useState } from "react";
import type { Member } from "../model/Member";

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

export default function useMembers(): Member[] {
    const [data, setData] = useState<Member[]>([]);

    useEffect(() => {
        let ignore = false;
        const supabaseUrl = (import.meta.env as Record<string, string | undefined>).VITE_SUPABASE_URL ?? "https://axxplyuhlgrqbvwpulio.supabase.co";
        const anonKey = (import.meta.env as Record<string, string | undefined>).VITE_SUPABASE_CLIENT_ANON_KEY;

        if (!anonKey) {
            console.warn("VITE_SUPABASE_CLIENT_ANON_KEY is missing.");
            return;
        }

        fetch(`${supabaseUrl}/rest/v1/rpc/getmembers`, {
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
            .then((result) => {
                if (!ignore) {
                    setData(normalizeMembersPayload(result));
                }
            })
            .catch((error) => {
                console.warn("Supabase family data could not be loaded.", error);
                if (!ignore) {
                    setData([]);
                }
            });

        return () => {
            ignore = true;
        };
    }, []);

    return data;
}