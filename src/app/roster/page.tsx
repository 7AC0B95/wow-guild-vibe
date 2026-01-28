'use client';

import React, { useState } from 'react';
import { Search, Filter, Users, ExternalLink, ChevronDown } from 'lucide-react';
import { Card, CardContent, ClassIcon, ClassBadge, RoleBadge } from '@/components/ui';
import { CLASS_COLORS, RANK_ORDER } from '@/lib/constants';
import { WowClass, Role, GuildRank, Character } from '@/lib/types';

// Mock data for demo purposes
const mockCharacters: Character[] = [
    {
        id: '1',
        userId: 'u1',
        name: 'Artherius',
        wowClass: 'Warrior',
        race: 'Human',
        role: 'Tank',
        faction: 'Alliance',
        rank: 'Guild Master',
        isMain: true,
        level: 70,
        professions: ['Blacksmithing', 'Mining'],
        upgradesUrl: 'https://seventyupgrades.com',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
    },
    {
        id: '2',
        userId: 'u2',
        name: 'Moonweaver',
        wowClass: 'Druid',
        race: 'Night Elf',
        role: 'Healer',
        faction: 'Alliance',
        rank: 'Officer',
        isMain: true,
        level: 70,
        professions: ['Leatherworking', 'Skinning'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
    },
    {
        id: '3',
        userId: 'u3',
        name: 'Shadowstrike',
        wowClass: 'Rogue',
        race: 'Human',
        role: 'DPS',
        faction: 'Alliance',
        rank: 'Raider',
        isMain: true,
        level: 70,
        professions: ['Engineering', 'Mining'],
        upgradesUrl: 'https://seventyupgrades.com',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
    },
    {
        id: '4',
        userId: 'u4',
        name: 'Frostbolt',
        wowClass: 'Mage',
        race: 'Gnome',
        role: 'DPS',
        faction: 'Alliance',
        rank: 'Raider',
        isMain: true,
        level: 70,
        professions: ['Tailoring', 'Enchanting'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
    },
    {
        id: '5',
        userId: 'u5',
        name: 'Lightbringer',
        wowClass: 'Paladin',
        race: 'Human',
        role: 'Healer',
        faction: 'Alliance',
        rank: 'Raider',
        isMain: true,
        level: 70,
        professions: ['Alchemy', 'Herbalism'],
        upgradesUrl: 'https://seventyupgrades.com',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
    },
    {
        id: '6',
        userId: 'u6',
        name: 'Darkfire',
        wowClass: 'Warlock',
        race: 'Human',
        role: 'DPS',
        faction: 'Alliance',
        rank: 'Raider',
        isMain: true,
        level: 70,
        professions: ['Tailoring', 'Enchanting'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
    },
    {
        id: '7',
        userId: 'u7',
        name: 'Stoneshield',
        wowClass: 'Paladin',
        race: 'Dwarf',
        role: 'Tank',
        faction: 'Alliance',
        rank: 'Raider',
        isMain: true,
        level: 70,
        professions: ['Blacksmithing', 'Mining'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
    },
    {
        id: '8',
        userId: 'u8',
        name: 'Eagleeye',
        wowClass: 'Hunter',
        race: 'Dwarf',
        role: 'DPS',
        faction: 'Alliance',
        rank: 'Trial',
        isMain: true,
        level: 70,
        professions: ['Leatherworking', 'Skinning'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
    },
    {
        id: '9',
        userId: 'u9',
        name: 'Divinelight',
        wowClass: 'Priest',
        race: 'Human',
        role: 'Healer',
        faction: 'Alliance',
        rank: 'Raider',
        isMain: true,
        level: 70,
        professions: ['Tailoring', 'Enchanting'],
        upgradesUrl: 'https://seventyupgrades.com',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
    },
    {
        id: '10',
        userId: 'u10',
        name: 'Stormcaller',
        wowClass: 'Shaman',
        race: 'Draenei',
        role: 'Healer',
        faction: 'Alliance',
        rank: 'Raider',
        isMain: true,
        level: 70,
        professions: ['Alchemy', 'Herbalism'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
    },
];

const classOptions: WowClass[] = [
    'Warrior', 'Paladin', 'Hunter', 'Rogue', 'Priest', 'Shaman', 'Mage', 'Warlock', 'Druid'
];

const rankOptions: GuildRank[] = [
    'Guild Master', 'Officer', 'Raider', 'Trial', 'Member', 'Alt'
];

export default function RosterPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState<WowClass | 'all'>('all');
    const [selectedRank, setSelectedRank] = useState<GuildRank | 'all'>('all');
    const [showFilters, setShowFilters] = useState(false);

    // Filter characters
    const filteredCharacters = mockCharacters
        .filter((char) => {
            const matchesSearch = char.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesClass = selectedClass === 'all' || char.wowClass === selectedClass;
            const matchesRank = selectedRank === 'all' || char.rank === selectedRank;
            return matchesSearch && matchesClass && matchesRank;
        })
        .sort((a, b) => RANK_ORDER[a.rank] - RANK_ORDER[b.rank]);

    // Calculate roster stats
    const stats = {
        total: mockCharacters.length,
        tanks: mockCharacters.filter((c) => c.role === 'Tank').length,
        healers: mockCharacters.filter((c) => c.role === 'Healer').length,
        dps: mockCharacters.filter((c) => c.role === 'DPS').length,
    };

    return (
        <div className="min-h-screen portal-bg pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="gothic-heading text-4xl sm:text-5xl text-text-primary mb-4">
                        Guild Roster
                    </h1>
                    <p className="text-text-secondary max-w-2xl mx-auto">
                        Meet the brave adventurers of Dark Portal. Our ranks are filled with dedicated players
                        ready to conquer Outland.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <Card variant="glass">
                        <CardContent className="text-center py-4">
                            <p className="text-3xl font-bold text-text-primary">{stats.total}</p>
                            <p className="text-sm text-text-muted flex items-center justify-center gap-1">
                                <Users className="w-4 h-4" /> Total
                            </p>
                        </CardContent>
                    </Card>
                    <Card variant="glass">
                        <CardContent className="text-center py-4">
                            <p className="text-3xl font-bold text-[#4a90d9]">{stats.tanks}</p>
                            <p className="text-sm text-text-muted">Tanks</p>
                        </CardContent>
                    </Card>
                    <Card variant="glass">
                        <CardContent className="text-center py-4">
                            <p className="text-3xl font-bold text-[#4aff4a]">{stats.healers}</p>
                            <p className="text-sm text-text-muted">Healers</p>
                        </CardContent>
                    </Card>
                    <Card variant="glass">
                        <CardContent className="text-center py-4">
                            <p className="text-3xl font-bold text-[#ff4a4a]">{stats.dps}</p>
                            <p className="text-sm text-text-muted">DPS</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filters */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by character name..."
                                className="w-full pl-12 pr-4 py-3 rounded-lg bg-obsidian-light border border-stone-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-fel-green focus:ring-1 focus:ring-fel-green/50 transition-colors"
                            />
                        </div>

                        {/* Filter Toggle (Mobile) */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="sm:hidden btn-outline flex items-center justify-center gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Desktop Filters */}
                        <div className="hidden sm:flex gap-4">
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value as WowClass | 'all')}
                                className="px-4 py-3 rounded-lg bg-obsidian-light border border-stone-border text-text-primary focus:outline-none focus:border-fel-green transition-colors cursor-pointer"
                            >
                                <option value="all">All Classes</option>
                                {classOptions.map((cls) => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>

                            <select
                                value={selectedRank}
                                onChange={(e) => setSelectedRank(e.target.value as GuildRank | 'all')}
                                className="px-4 py-3 rounded-lg bg-obsidian-light border border-stone-border text-text-primary focus:outline-none focus:border-fel-green transition-colors cursor-pointer"
                            >
                                <option value="all">All Ranks</option>
                                {rankOptions.map((rank) => (
                                    <option key={rank} value={rank}>{rank}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Mobile Filters */}
                    {showFilters && (
                        <div className="sm:hidden mt-4 flex flex-col gap-4 p-4 rounded-lg bg-obsidian-light border border-stone-border">
                            <div>
                                <label className="block text-sm text-text-secondary mb-2">Class</label>
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value as WowClass | 'all')}
                                    className="w-full px-4 py-3 rounded-lg bg-obsidian border border-stone-border text-text-primary focus:outline-none focus:border-fel-green transition-colors cursor-pointer"
                                >
                                    <option value="all">All Classes</option>
                                    {classOptions.map((cls) => (
                                        <option key={cls} value={cls}>{cls}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-text-secondary mb-2">Rank</label>
                                <select
                                    value={selectedRank}
                                    onChange={(e) => setSelectedRank(e.target.value as GuildRank | 'all')}
                                    className="w-full px-4 py-3 rounded-lg bg-obsidian border border-stone-border text-text-primary focus:outline-none focus:border-fel-green transition-colors cursor-pointer"
                                >
                                    <option value="all">All Ranks</option>
                                    {rankOptions.map((rank) => (
                                        <option key={rank} value={rank}>{rank}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <p className="text-sm text-text-muted mb-4">
                    Showing {filteredCharacters.length} of {mockCharacters.length} characters
                </p>

                {/* Roster Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCharacters.map((character) => (
                        <Card
                            key={character.id}
                            variant="glass"
                            hover
                            className="transition-all duration-300"
                        >
                            <CardContent className="p-5">
                                <div className="flex items-start gap-4">
                                    {/* Class Icon */}
                                    <ClassIcon wowClass={character.wowClass} size="lg" />

                                    {/* Character Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3
                                                className="font-semibold text-lg truncate"
                                                style={{ color: CLASS_COLORS[character.wowClass] }}
                                            >
                                                {character.name}
                                            </h3>
                                            {character.isMain && (
                                                <span className="px-1.5 py-0.5 text-xs bg-ancient-gold/20 text-ancient-gold rounded">
                                                    Main
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm text-text-secondary mb-2">
                                            {character.race} {character.wowClass}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <RoleBadge role={character.role} />
                                            <span className="text-xs text-text-muted">•</span>
                                            <span className="text-xs text-text-secondary">{character.rank}</span>
                                        </div>

                                        {/* Professions */}
                                        {character.professions.length > 0 && (
                                            <p className="text-xs text-text-muted mb-3">
                                                {character.professions.join(' • ')}
                                            </p>
                                        )}

                                        {/* Upgrades Link */}
                                        {character.upgradesUrl && (
                                            <a
                                                href={character.upgradesUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs text-fel-green hover:underline"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                                Seventy Upgrades
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {filteredCharacters.length === 0 && (
                    <div className="text-center py-16">
                        <Users className="w-16 h-16 mx-auto text-text-muted mb-4" />
                        <h3 className="text-xl font-medium text-text-primary mb-2">No characters found</h3>
                        <p className="text-text-secondary">
                            Try adjusting your search or filter criteria
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
