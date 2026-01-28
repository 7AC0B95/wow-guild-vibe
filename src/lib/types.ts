// WoW TBC Character Types

export type WowClass =
    | 'Warrior'
    | 'Paladin'
    | 'Hunter'
    | 'Rogue'
    | 'Priest'
    | 'Shaman'
    | 'Mage'
    | 'Warlock'
    | 'Druid';

export type WowRace =
    | 'Human'
    | 'Dwarf'
    | 'Night Elf'
    | 'Gnome'
    | 'Draenei'
    | 'Orc'
    | 'Undead'
    | 'Tauren'
    | 'Troll'
    | 'Blood Elf';

export type Role = 'Tank' | 'Healer' | 'DPS';

export type Faction = 'Alliance' | 'Horde';

export type GuildRank =
    | 'Guild Master'
    | 'Officer'
    | 'Raider'
    | 'Trial'
    | 'Member'
    | 'Alt';

export interface Character {
    id: string;
    userId: string;
    name: string;
    wowClass: WowClass;
    race: WowRace;
    role: Role;
    faction: Faction;
    rank: GuildRank;
    isMain: boolean;
    level: number;
    professions: string[];
    upgradesUrl?: string; // Seventy Upgrades / Sixty Upgrades link
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    characters: Character[];
    createdAt: string;
}

// Calendar / Raid Events

export type EventStatus = 'Signed Up' | 'Tentative' | 'Absent';

export interface RaidEvent {
    id: string;
    title: string;
    description?: string;
    raidInstance: string;
    date: string;
    startTime: string;
    endTime?: string;
    maxTanks: number;
    maxHealers: number;
    maxDps: number;
    createdBy: string;
    createdAt: string;
}

export interface EventSignup {
    id: string;
    eventId: string;
    characterId: string;
    character?: Character;
    status: EventStatus;
    note?: string;
    createdAt: string;
}

export interface RoleTally {
    tanks: { current: number; max: number };
    healers: { current: number; max: number };
    dps: { current: number; max: number };
}

// Forum Types

export type ForumCategory =
    | 'General'
    | 'Raiding'
    | 'Professions'
    | 'Loot';

export interface ForumPost {
    id: string;
    categoryId: ForumCategory;
    title: string;
    content: string;
    authorId: string;
    author?: User;
    isPinned: boolean;
    isLocked: boolean;
    viewCount: number;
    replyCount: number;
    lastReplyAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ForumReply {
    id: string;
    postId: string;
    content: string;
    authorId: string;
    author?: User;
    createdAt: string;
    updatedAt: string;
}

// Navigation

export interface NavItem {
    label: string;
    href: string;
    icon?: string;
    requiresAuth?: boolean;
}
