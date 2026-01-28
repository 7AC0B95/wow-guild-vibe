// WoW TBC Constants

import { WowClass, GuildRank, ForumCategory, NavItem } from './types';

// Class color mappings (official WoW colors)
export const CLASS_COLORS: Record<WowClass, string> = {
    Warrior: '#C79C6E',
    Paladin: '#F58CBA',
    Hunter: '#ABD473',
    Rogue: '#FFF569',
    Priest: '#FFFFFF',
    Shaman: '#0070DE',
    Mage: '#69CCF0',
    Warlock: '#9482C9',
    Druid: '#FF7D0A',
};

// Class icons (using Lucide icon names as fallback, can be replaced with actual WoW icons)
export const CLASS_ICONS: Record<WowClass, string> = {
    Warrior: 'Sword',
    Paladin: 'Shield',
    Hunter: 'Target',
    Rogue: 'Eye',
    Priest: 'Cross',
    Shaman: 'Zap',
    Mage: 'Snowflake',
    Warlock: 'Flame',
    Druid: 'Leaf',
};

// Role colors
export const ROLE_COLORS = {
    Tank: '#4a90d9',
    Healer: '#4aff4a',
    DPS: '#ff4a4a',
};

// Role icons
export const ROLE_ICONS = {
    Tank: 'Shield',
    Healer: 'Heart',
    DPS: 'Sword',
};

// Guild ranks with their display order
export const RANK_ORDER: Record<GuildRank, number> = {
    'Guild Master': 0,
    'Officer': 1,
    'Raider': 2,
    'Trial': 3,
    'Member': 4,
    'Alt': 5,
};

// TBC Raid Instances
export const RAID_INSTANCES = [
    'Karazhan',
    'Gruul\'s Lair',
    'Magtheridon\'s Lair',
    'Serpentshrine Cavern',
    'Tempest Keep: The Eye',
    'Mount Hyjal',
    'Black Temple',
    'Sunwell Plateau',
    'Zul\'Aman',
] as const;

// Forum categories with icons and descriptions
export const FORUM_CATEGORIES: Record<ForumCategory, { icon: string; description: string; color: string }> = {
    General: {
        icon: 'MessageSquare',
        description: 'General guild discussion and announcements',
        color: '#32CD32',
    },
    Raiding: {
        icon: 'Swords',
        description: 'Raid strategies, signups, and loot distribution',
        color: '#9945FF',
    },
    Professions: {
        icon: 'Hammer',
        description: 'Crafting requests, profession tips, and materials',
        color: '#FFD700',
    },
    Loot: {
        icon: 'Gift',
        description: 'Loot council decisions, BiS discussions, and upgrades',
        color: '#FF4500',
    },
};

// Navigation items
export const NAV_ITEMS: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Roster', href: '/roster' },
    { label: 'Calendar', href: '/calendar' },
    { label: 'Forum', href: '/forum' },
    { label: 'Profile', href: '/profile', requiresAuth: true },
];

// Default raid composition
export const DEFAULT_RAID_COMPOSITION = {
    tanks: 2,
    healers: 6,
    dps: 17,
};

// Animation durations
export const ANIMATIONS = {
    fast: 150,
    normal: 300,
    slow: 500,
};

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};

// Local storage keys
export const STORAGE_KEYS = {
    theme: 'wow-guild-theme',
    lastVisited: 'wow-guild-last-visited',
};
