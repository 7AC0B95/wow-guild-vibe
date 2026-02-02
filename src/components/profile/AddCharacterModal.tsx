'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Check, Plus, Trash2 } from 'lucide-react';
import { Button, ClassIcon } from '@/components/ui';
import { CLASS_COLORS } from '@/lib/constants';
import { WowClass, WowRace, Role, Faction, GuildRank, Character } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface AddCharacterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCharacterAdded: (character: Character) => void;
    userId: string;
}

// TBC Classes
const CLASSES: WowClass[] = [
    'Warrior', 'Paladin', 'Hunter', 'Rogue', 'Priest', 'Shaman', 'Mage', 'Warlock', 'Druid'
];

// TBC Races by faction
const ALLIANCE_RACES: WowRace[] = ['Human', 'Dwarf', 'Night Elf', 'Gnome', 'Draenei'];
const HORDE_RACES: WowRace[] = ['Orc', 'Undead', 'Tauren', 'Troll', 'Blood Elf'];

// Roles
const ROLES: Role[] = ['Tank', 'Healer', 'DPS'];

// Guild Ranks
const RANKS: GuildRank[] = ['Guild Master', 'Officer', 'Raider', 'Trial', 'Member', 'Alt'];

// Available professions in TBC
const PROFESSIONS = [
    'Alchemy', 'Blacksmithing', 'Enchanting', 'Engineering', 'Herbalism',
    'Jewelcrafting', 'Leatherworking', 'Mining', 'Skinning', 'Tailoring'
];

// Class-Race restrictions for TBC
const CLASS_RACE_RESTRICTIONS: Record<WowClass, WowRace[]> = {
    Warrior: ['Human', 'Dwarf', 'Night Elf', 'Gnome', 'Draenei', 'Orc', 'Undead', 'Tauren', 'Troll'],
    Paladin: ['Human', 'Dwarf', 'Draenei', 'Blood Elf'],
    Hunter: ['Dwarf', 'Night Elf', 'Draenei', 'Orc', 'Tauren', 'Troll', 'Blood Elf'],
    Rogue: ['Human', 'Dwarf', 'Night Elf', 'Gnome', 'Orc', 'Undead', 'Troll', 'Blood Elf'],
    Priest: ['Human', 'Dwarf', 'Night Elf', 'Draenei', 'Undead', 'Troll', 'Blood Elf'],
    Shaman: ['Draenei', 'Orc', 'Tauren', 'Troll'],
    Mage: ['Human', 'Gnome', 'Draenei', 'Undead', 'Troll', 'Blood Elf'],
    Warlock: ['Human', 'Gnome', 'Orc', 'Undead', 'Blood Elf'],
    Druid: ['Night Elf', 'Tauren'],
};

// Determine faction from race
const getRaceFaction = (race: WowRace): Faction => {
    return ALLIANCE_RACES.includes(race) ? 'Alliance' : 'Horde';
};

export default function AddCharacterModal({
    isOpen,
    onClose,
    onCharacterAdded,
    userId
}: AddCharacterModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [name, setName] = useState('');
    const [wowClass, setWowClass] = useState<WowClass>('Warrior');
    const [race, setRace] = useState<WowRace>('Human');
    const [role, setRole] = useState<Role>('DPS');
    const [rank, setRank] = useState<GuildRank>('Member');
    const [level, setLevel] = useState(70);
    const [professions, setProfessions] = useState<string[]>([]);
    const [upgradesUrl, setUpgradesUrl] = useState('');
    const [isMain, setIsMain] = useState(false);

    // Get available races for selected class
    const availableRaces = CLASS_RACE_RESTRICTIONS[wowClass];

    // Determine faction from race
    const faction = getRaceFaction(race);

    // Reset race when class changes if current race is not valid
    useEffect(() => {
        if (!availableRaces.includes(race)) {
            setRace(availableRaces[0]);
        }
    }, [wowClass, availableRaces, race]);

    // Reset form
    const resetForm = () => {
        setName('');
        setWowClass('Warrior');
        setRace('Human');
        setRole('DPS');
        setRank('Member');
        setLevel(70);
        setProfessions([]);
        setUpgradesUrl('');
        setIsMain(false);
        setError(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const toggleProfession = (prof: string) => {
        if (professions.includes(prof)) {
            setProfessions(professions.filter(p => p !== prof));
        } else if (professions.length < 2) {
            setProfessions([...professions, prof]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            // Validate
            if (!name.trim()) {
                throw new Error('Character name is required');
            }

            if (name.trim().length < 2 || name.trim().length > 12) {
                throw new Error('Character name must be 2-12 characters');
            }

            console.log('[AddCharacter] Starting character creation for user:', userId);

            // First ensure we have a valid session
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

            if (sessionError) {
                console.error('[AddCharacter] Session error:', sessionError);
                throw new Error('Authentication error. Please sign out and sign back in.');
            }

            if (!sessionData.session) {
                throw new Error('No active session. Please sign in again.');
            }

            console.log('[AddCharacter] Session verified, user email:', sessionData.session.user.email);

            // Try to upsert the profile first (create if not exists)
            const userEmail = sessionData.session.user.email || 'unknown@user.com';
            console.log('[AddCharacter] Ensuring profile exists...');

            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: userId,
                    email: userEmail,
                    display_name: userEmail.split('@')[0],
                }, {
                    onConflict: 'id',
                    ignoreDuplicates: true
                });

            if (profileError) {
                console.error('[AddCharacter] Profile upsert error:', profileError);
                // Don't throw - profile might already exist, continue with character creation
            } else {
                console.log('[AddCharacter] Profile ensured');
            }

            // If this character will be main, unset other mains first
            if (isMain) {
                console.log('[AddCharacter] Unsetting existing main characters...');
                await supabase
                    .from('characters')
                    .update({ is_main: false })
                    .eq('user_id', userId);
            }

            console.log('[AddCharacter] Inserting character...');

            // Insert the character
            const { data, error: insertError } = await supabase
                .from('characters')
                .insert({
                    user_id: userId,
                    name: name.trim(),
                    wow_class: wowClass,
                    race: race,
                    role: role,
                    faction: faction,
                    rank: rank,
                    level: level,
                    professions: professions,
                    upgrades_url: upgradesUrl.trim() || null,
                    is_main: isMain,
                })
                .select()
                .single();

            if (insertError) {
                console.error('[AddCharacter] Insert error:', insertError);

                // Provide more helpful error messages
                if (insertError.message.includes('violates foreign key constraint')) {
                    throw new Error('Profile setup incomplete. Please refresh the page and try again.');
                }
                if (insertError.message.includes('relation') && insertError.message.includes('does not exist')) {
                    throw new Error('Database not configured. Please run the SQL schema in Supabase.');
                }

                throw new Error(insertError.message || 'Failed to add character to database');
            }

            if (!data) {
                throw new Error('No data returned from insert');
            }

            console.log('[AddCharacter] Character created successfully:', data.id);

            // Transform to Character type
            const newCharacter: Character = {
                id: data.id,
                userId: data.user_id,
                name: data.name,
                wowClass: data.wow_class as WowClass,
                race: data.race as WowRace,
                role: data.role as Role,
                faction: data.faction as Faction,
                rank: data.rank as GuildRank,
                isMain: data.is_main,
                level: data.level,
                professions: data.professions,
                upgradesUrl: data.upgrades_url || undefined,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
            };

            onCharacterAdded(newCharacter);
            handleClose();
        } catch (err) {
            console.error('[AddCharacter] Error:', err);
            setError(err instanceof Error ? err.message : 'Failed to add character');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-obsidian-light border border-stone-border rounded-xl shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-stone-border bg-obsidian-light">
                    <h2 className="gothic-heading text-xl text-text-primary flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-fel-green/20 flex items-center justify-center">
                            <Plus className="w-5 h-5 text-fel-green" />
                        </div>
                        Add New Character
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-lg hover:bg-obsidian-lighter text-text-muted hover:text-text-primary transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-4 rounded-lg bg-hellfire-red/20 border border-hellfire-red/50 text-hellfire-red text-sm">
                            {error}
                        </div>
                    )}

                    {/* Character Name */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Character Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter character name"
                            className="w-full px-4 py-3 rounded-lg bg-obsidian border border-stone-border 
                                     text-text-primary placeholder:text-text-muted
                                     focus:outline-none focus:border-fel-green focus:ring-1 focus:ring-fel-green
                                     transition-colors"
                            maxLength={12}
                            required
                        />
                    </div>

                    {/* Class Selection */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-3">
                            Class
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                            {CLASSES.map((cls) => (
                                <button
                                    key={cls}
                                    type="button"
                                    onClick={() => setWowClass(cls)}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all
                                              ${wowClass === cls
                                            ? 'border-fel-green bg-fel-green/10'
                                            : 'border-stone-border hover:border-stone-gray bg-obsidian hover:bg-obsidian-lighter'
                                        }`}
                                >
                                    <ClassIcon wowClass={cls} size="md" />
                                    <span
                                        className="text-xs font-medium"
                                        style={{ color: wowClass === cls ? CLASS_COLORS[cls] : 'var(--text-secondary)' }}
                                    >
                                        {cls}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Race Selection */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-3">
                            Race
                            <span className="ml-2 text-xs text-text-muted">
                                ({faction})
                            </span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            {availableRaces.map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRace(r)}
                                    className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all
                                              ${race === r
                                            ? 'border-fel-green bg-fel-green/10 text-fel-green'
                                            : 'border-stone-border hover:border-stone-gray text-text-secondary bg-obsidian hover:bg-obsidian-lighter'
                                        }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Role & Rank */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-3">
                                Role
                            </label>
                            <div className="flex gap-2">
                                {ROLES.map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setRole(r)}
                                        className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all
                                                  ${role === r
                                                ? r === 'Tank'
                                                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                                                    : r === 'Healer'
                                                        ? 'border-green-500 bg-green-500/10 text-green-400'
                                                        : 'border-red-500 bg-red-500/10 text-red-400'
                                                : 'border-stone-border hover:border-stone-gray text-text-secondary bg-obsidian hover:bg-obsidian-lighter'
                                            }`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Rank */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-3">
                                Guild Rank
                            </label>
                            <select
                                value={rank}
                                onChange={(e) => setRank(e.target.value as GuildRank)}
                                className="w-full px-4 py-2.5 rounded-lg bg-obsidian border border-stone-border 
                                         text-text-primary focus:outline-none focus:border-fel-green focus:ring-1 focus:ring-fel-green
                                         transition-colors cursor-pointer"
                            >
                                {RANKS.map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Level */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Level: <span className="text-fel-green font-bold">{level}</span>
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="70"
                            value={level}
                            onChange={(e) => setLevel(parseInt(e.target.value))}
                            className="w-full h-2 bg-obsidian rounded-lg appearance-none cursor-pointer
                                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 
                                     [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full 
                                     [&::-webkit-slider-thumb]:bg-fel-green [&::-webkit-slider-thumb]:cursor-pointer
                                     [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-fel-green-dark
                                     [&::-webkit-slider-thumb]:shadow-lg"
                        />
                        <div className="flex justify-between text-xs text-text-muted mt-1">
                            <span>1</span>
                            <span>70</span>
                        </div>
                    </div>

                    {/* Professions */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Professions
                            <span className="text-xs text-text-muted ml-2">(Select up to 2)</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {PROFESSIONS.map((prof) => (
                                <button
                                    key={prof}
                                    type="button"
                                    onClick={() => toggleProfession(prof)}
                                    disabled={!professions.includes(prof) && professions.length >= 2}
                                    className={`px-3 py-1.5 rounded-lg border text-sm transition-all
                                              ${professions.includes(prof)
                                            ? 'border-ancient-gold bg-ancient-gold/10 text-ancient-gold'
                                            : professions.length >= 2
                                                ? 'border-stone-border text-text-muted opacity-50 cursor-not-allowed bg-obsidian'
                                                : 'border-stone-border hover:border-stone-gray text-text-secondary bg-obsidian hover:bg-obsidian-lighter'
                                        }`}
                                >
                                    {professions.includes(prof) && <Check className="w-3 h-3 inline mr-1" />}
                                    {prof}
                                </button>
                            ))}
                        </div>
                        {professions.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setProfessions([])}
                                className="mt-2 text-xs text-text-muted hover:text-hellfire-red flex items-center gap-1"
                            >
                                <Trash2 className="w-3 h-3" />
                                Clear professions
                            </button>
                        )}
                    </div>

                    {/* Upgrades URL */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Seventy Upgrades URL
                            <span className="text-xs text-text-muted ml-2">(optional)</span>
                        </label>
                        <input
                            type="url"
                            value={upgradesUrl}
                            onChange={(e) => setUpgradesUrl(e.target.value)}
                            placeholder="https://seventyupgrades.com/set/..."
                            className="w-full px-4 py-3 rounded-lg bg-obsidian border border-stone-border 
                                     text-text-primary placeholder:text-text-muted
                                     focus:outline-none focus:border-fel-green focus:ring-1 focus:ring-fel-green
                                     transition-colors"
                        />
                    </div>

                    {/* Main Character Toggle */}
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-obsidian border border-stone-border">
                        <button
                            type="button"
                            onClick={() => setIsMain(!isMain)}
                            className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0
                                      ${isMain ? 'bg-ancient-gold' : 'bg-stone-gray'}`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200
                                          ${isMain ? 'translate-x-5' : 'translate-x-0'}`}
                            />
                        </button>
                        <div>
                            <p className="text-sm font-medium text-text-primary">Set as Main Character</p>
                            <p className="text-xs text-text-muted">This will be your primary character for raids</p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !name.trim()}
                            className="flex-1"
                            icon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Character'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
