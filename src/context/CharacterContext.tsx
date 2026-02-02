'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Character, WowClass, WowRace, Role, Faction, GuildRank } from '@/lib/types';

interface CharacterContextType {
    characters: Character[];
    loading: boolean;
    error: string | null;
    refreshCharacters: (force?: boolean) => Promise<void>;
    addCharacter: (character: Character) => void;
    updateCharacter: (character: Character) => void;
    removeCharacter: (id: string) => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export function CharacterProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cache tracking
    const hasFetchedRef = useRef(false);
    const lastFetchRef = useRef<number>(0);
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

    const fetchCharacters = useCallback(async (force = false) => {
        if (!user) {
            setCharacters([]);
            hasFetchedRef.current = false;
            return;
        }

        // Return cached data if available and fresh
        const now = Date.now();
        if (!force && hasFetchedRef.current && (now - lastFetchRef.current < CACHE_DURATION)) {
            return;
        }

        // Use loading state only for initial fetch or explicit force
        if (characters.length === 0 || force) {
            setLoading(true);
        }
        setError(null);

        try {
            const { data, error } = await supabase
                .from('characters')
                .select('*')
                .eq('user_id', user.id)
                .order('is_main', { ascending: false })
                .order('created_at', { ascending: true });

            if (error) throw error;

            const transformedCharacters: Character[] = (data || []).map(row => ({
                id: row.id,
                userId: row.user_id,
                name: row.name,
                wowClass: row.wow_class as WowClass,
                race: row.race as WowRace,
                role: row.role as Role,
                faction: row.faction as Faction,
                rank: row.rank as GuildRank,
                isMain: row.is_main,
                level: row.level,
                professions: row.professions || [],
                upgradesUrl: row.upgrades_url || undefined,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            }));

            setCharacters(transformedCharacters);
            hasFetchedRef.current = true;
            lastFetchRef.current = Date.now();
        } catch (err) {
            console.error('Failed to fetch characters:', err);
            // Keep existing data if refresh fails
            if (characters.length === 0) {
                setError(err instanceof Error ? err.message : 'Failed to load characters');
            }
        } finally {
            setLoading(false);
        }
    }, [user]); // Removed characters dependency to avoid loops

    // Initial fetch when user logs in
    useEffect(() => {
        if (user && !hasFetchedRef.current) {
            fetchCharacters();
        } else if (!user) {
            setCharacters([]);
            hasFetchedRef.current = false;
        }
    }, [user, fetchCharacters]);

    // Optimistic helpers
    const addCharacter = useCallback((newCharacter: Character) => {
        setCharacters(prev => {
            // Check if this new character is a main and we already have one
            if (newCharacter.isMain) {
                return [...prev.map(c => ({ ...c, isMain: false })), newCharacter]
                    .sort((a, b) => (a.isMain === b.isMain ? 0 : a.isMain ? -1 : 1));
            }
            return [...prev, newCharacter];
        });
    }, []);

    const updateCharacter = useCallback((updated: Character) => {
        setCharacters(prev => {
            let newChars = prev.map(c => c.id === updated.id ? updated : c);

            // Handle main character switch logic
            if (updated.isMain) {
                newChars = newChars.map(c =>
                    c.id === updated.id ? c : { ...c, isMain: false }
                );
            }

            // Re-sort
            return newChars.sort((a, b) => {
                if (a.isMain !== b.isMain) return a.isMain ? -1 : 1;
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            });
        });
    }, []);

    const removeCharacter = useCallback((id: string) => {
        setCharacters(prev => prev.filter(c => c.id !== id));
    }, []);

    const value = {
        characters,
        loading,
        error,
        refreshCharacters: fetchCharacters,
        addCharacter,
        updateCharacter,
        removeCharacter
    };

    return (
        <CharacterContext.Provider value={value}>
            {children}
        </CharacterContext.Provider>
    );
}

export function useCharacters() {
    const context = useContext(CharacterContext);
    if (context === undefined) {
        throw new Error('useCharacters must be used within a CharacterProvider');
    }
    return context;
}
