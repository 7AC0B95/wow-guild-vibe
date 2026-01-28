'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    User,
    Plus,
    Edit,
    Trash2,
    ExternalLink,
    Shield,
    Heart,
    Swords,
    Star,
    Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, ClassIcon, RoleBadge, ClassBadge } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { CLASS_COLORS } from '@/lib/constants';
import { Character, WowClass, Role } from '@/lib/types';

// Mock user characters
const mockCharacters: Character[] = [
    {
        id: '1',
        userId: 'current-user',
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
        userId: 'current-user',
        name: 'Thunderbolt',
        wowClass: 'Shaman',
        race: 'Draenei',
        role: 'Healer',
        faction: 'Alliance',
        rank: 'Alt',
        isMain: false,
        level: 70,
        professions: ['Alchemy', 'Herbalism'],
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
    },
];

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [characters, setCharacters] = useState(mockCharacters);
    const [showAddModal, setShowAddModal] = useState(false);

    // Redirect if not logged in
    if (!loading && !user) {
        router.push('/login');
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen portal-bg pt-24 pb-16 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-fel-green border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const handleDeleteCharacter = (id: string) => {
        if (confirm('Are you sure you want to delete this character?')) {
            setCharacters(characters.filter((c) => c.id !== id));
        }
    };

    const handleSetMain = (id: string) => {
        setCharacters(characters.map((c) => ({
            ...c,
            isMain: c.id === id,
        })));
    };

    return (
        <div className="min-h-screen portal-bg pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <div className="mb-8">
                    <Card variant="stone">
                        <CardContent className="p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-fel-green via-ethereal-purple to-hellfire-orange p-1">
                                        <div className="w-full h-full rounded-full bg-obsidian flex items-center justify-center">
                                            <span className="text-3xl font-heading font-bold text-fel-green">
                                                {user?.email?.[0].toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-2 rounded-full bg-obsidian-light border border-stone-border hover:border-fel-green transition-colors">
                                        <Edit className="w-4 h-4 text-text-secondary" />
                                    </button>
                                </div>

                                {/* User Info */}
                                <div className="flex-1 text-center sm:text-left">
                                    <h1 className="gothic-heading text-2xl sm:text-3xl text-text-primary mb-2">
                                        {user?.email?.split('@')[0]}
                                    </h1>
                                    <p className="text-text-secondary mb-4">{user?.email}</p>
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                        <span className="px-3 py-1 rounded-full bg-ancient-gold/20 text-ancient-gold text-sm font-medium">
                                            Guild Master
                                        </span>
                                        <span className="text-sm text-text-muted">
                                            Member since Jan 2024
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <Button variant="outline" size="sm" icon={<Settings className="w-4 h-4" />}>
                                        Settings
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Characters Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="gothic-heading text-xl text-text-primary flex items-center gap-2">
                            <User className="w-6 h-6 text-fel-green" />
                            My Characters
                        </h2>
                        <Button
                            size="sm"
                            icon={<Plus className="w-4 h-4" />}
                            onClick={() => setShowAddModal(true)}
                        >
                            Add Character
                        </Button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {characters.map((character) => (
                            <Card
                                key={character.id}
                                variant="glass"
                                className={character.isMain ? 'ring-2 ring-ancient-gold' : ''}
                            >
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-4">
                                        <ClassIcon wowClass={character.wowClass} size="lg" />

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3
                                                    className="font-semibold text-lg"
                                                    style={{ color: CLASS_COLORS[character.wowClass] }}
                                                >
                                                    {character.name}
                                                </h3>
                                                {character.isMain && (
                                                    <Star className="w-4 h-4 text-ancient-gold fill-ancient-gold" />
                                                )}
                                            </div>

                                            <p className="text-sm text-text-secondary mb-2">
                                                Level {character.level} {character.race} {character.wowClass}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                                <RoleBadge role={character.role} />
                                                <span className="text-xs text-text-muted">{character.rank}</span>
                                            </div>

                                            {character.professions.length > 0 && (
                                                <p className="text-xs text-text-muted mb-3">
                                                    {character.professions.join(' • ')}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-2">
                                                {character.upgradesUrl ? (
                                                    <a
                                                        href={character.upgradesUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-xs text-fel-green hover:underline"
                                                    >
                                                        <ExternalLink className="w-3 h-3" />
                                                        Seventy Upgrades
                                                    </a>
                                                ) : (
                                                    <button className="text-xs text-ethereal-purple hover:underline">
                                                        + Add Upgrades Link
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2">
                                            {!character.isMain && (
                                                <button
                                                    onClick={() => handleSetMain(character.id)}
                                                    className="p-2 rounded-lg hover:bg-obsidian-lighter text-text-muted 
                                     hover:text-ancient-gold transition-colors"
                                                    title="Set as main"
                                                >
                                                    <Star className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                className="p-2 rounded-lg hover:bg-obsidian-lighter text-text-muted 
                                   hover:text-text-primary transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCharacter(character.id)}
                                                className="p-2 rounded-lg hover:bg-hellfire-red/20 text-text-muted 
                                   hover:text-hellfire-red transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Add Character Card */}
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="min-h-[200px] border-2 border-dashed border-stone-border rounded-xl
                         flex flex-col items-center justify-center gap-3
                         hover:border-fel-green hover:bg-fel-green/5 transition-all"
                        >
                            <div className="w-12 h-12 rounded-full bg-fel-green/20 flex items-center justify-center">
                                <Plus className="w-6 h-6 text-fel-green" />
                            </div>
                            <span className="text-text-secondary">Add New Character</span>
                        </button>
                    </div>
                </div>

                {/* Activity & Stats */}
                <div className="grid sm:grid-cols-3 gap-4">
                    <Card variant="glass">
                        <CardContent className="p-5 text-center">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-ethereal-purple/20 
                              flex items-center justify-center">
                                <Swords className="w-6 h-6 text-ethereal-purple" />
                            </div>
                            <p className="text-2xl font-bold text-text-primary mb-1">24</p>
                            <p className="text-sm text-text-muted">Raids Attended</p>
                        </CardContent>
                    </Card>

                    <Card variant="glass">
                        <CardContent className="p-5 text-center">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-fel-green/20 
                              flex items-center justify-center">
                                <Shield className="w-6 h-6 text-fel-green" />
                            </div>
                            <p className="text-2xl font-bold text-text-primary mb-1">96%</p>
                            <p className="text-sm text-text-muted">Attendance Rate</p>
                        </CardContent>
                    </Card>

                    <Card variant="glass">
                        <CardContent className="p-5 text-center">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-ancient-gold/20 
                              flex items-center justify-center">
                                <Heart className="w-6 h-6 text-ancient-gold" />
                            </div>
                            <p className="text-2xl font-bold text-text-primary mb-1">12</p>
                            <p className="text-sm text-text-muted">Forum Posts</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
