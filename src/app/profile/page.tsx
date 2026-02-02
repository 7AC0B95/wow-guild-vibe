'use client';

import React, { useState, useEffect } from 'react';
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
    Settings,
    Loader2,
    AlertCircle,
    RefreshCw
} from 'lucide-react';
import { Card, CardContent, Button, ClassIcon, RoleBadge } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useCharacters } from '@/context/CharacterContext';
import { CLASS_COLORS } from '@/lib/constants';
import { Character } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import AddCharacterModal from '@/components/profile/AddCharacterModal';
import EditCharacterModal from '@/components/profile/EditCharacterModal';
import ConfirmDeleteModal from '@/components/profile/ConfirmDeleteModal';

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    // Context state
    const {
        characters,
        loading: loadingCharacters,
        error: charactersError,
        refreshCharacters,
        addCharacter,
        updateCharacter,
        removeCharacter
    } = useCharacters();

    // Modal state
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

    // Deleting state
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null);

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [authLoading, user, router]);

    // Handle character deletion
    const handleDeleteCharacter = async () => {
        if (!characterToDelete) return;

        setDeletingId(characterToDelete.id);

        try {
            const { error } = await supabase
                .from('characters')
                .delete()
                .eq('id', characterToDelete.id);

            if (error) throw error;

            removeCharacter(characterToDelete.id);
            setCharacterToDelete(null);
        } catch (err) {
            console.error('Failed to delete character:', err);
            alert('Failed to delete character. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

    // Handle setting a character as main
    const handleSetMain = async (character: Character) => {
        try {
            // First, unset all characters as main
            await supabase
                .from('characters')
                .update({ is_main: false })
                .eq('user_id', user!.id);

            // Then set the selected character as main
            const { error } = await supabase
                .from('characters')
                .update({ is_main: true })
                .eq('id', character.id);

            if (error) throw error;

            // Update local state via context (context handles untoggling others)
            updateCharacter({ ...character, isMain: true });
        } catch (err) {
            console.error('Failed to set main character:', err);
            alert('Failed to update main character. Please try again.');
            // Revert by refreshing
            refreshCharacters(true);
        }
    };

    // Loading state
    if (authLoading) {
        return (
            <div className="min-h-screen portal-bg pt-24 pb-16 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-fel-green border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Not logged in (will redirect)
    if (!user) {
        return null;
    }

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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <h2 className="gothic-heading text-xl text-text-primary flex items-center gap-2">
                            <User className="w-5 h-5 sm:w-6 sm:h-6 text-fel-green" />
                            My Characters
                            {characters.length > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-fel-green/20 text-fel-green text-sm font-normal">
                                    {characters.length}
                                </span>
                            )}
                        </h2>
                        <div className="flex gap-2">
                            {charactersError && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    icon={<RefreshCw className="w-4 h-4" />}
                                    onClick={() => refreshCharacters(true)}
                                >
                                    Retry
                                </Button>
                            )}
                            <Button
                                size="sm"
                                icon={<Plus className="w-4 h-4" />}
                                onClick={() => setShowAddModal(true)}
                                className="whitespace-nowrap"
                            >
                                Add Character
                            </Button>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loadingCharacters && characters.length === 0 && (
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="h-48 rounded-xl bg-obsidian-light animate-pulse border border-stone-border" />
                            ))}
                        </div>
                    )}

                    {/* Error State */}
                    {!loadingCharacters && charactersError && characters.length === 0 && (
                        <div className="p-6 rounded-xl bg-hellfire-red/10 border border-hellfire-red/30 flex items-center gap-4">
                            <AlertCircle className="w-8 h-8 text-hellfire-red flex-shrink-0" />
                            <div>
                                <p className="text-text-primary font-medium">Failed to load characters</p>
                                <p className="text-text-secondary text-sm">{charactersError}</p>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loadingCharacters && !charactersError && characters.length === 0 && (
                        <Card variant="glass" className="border-dashed border-2">
                            <CardContent className="p-12 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-fel-green/20 flex items-center justify-center">
                                    <User className="w-8 h-8 text-fel-green" />
                                </div>
                                <h3 className="text-lg font-semibold text-text-primary mb-2">
                                    No characters yet
                                </h3>
                                <p className="text-text-secondary mb-6 max-w-md mx-auto">
                                    Add your first World of Warcraft character to start signing up for raids and participating in guild activities.
                                </p>
                                <Button
                                    icon={<Plus className="w-4 h-4" />}
                                    onClick={() => setShowAddModal(true)}
                                >
                                    Add Your First Character
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Characters Grid */}
                    {characters.length > 0 && (
                        <div className="grid sm:grid-cols-2 gap-4">
                            {characters.map((character) => (
                                <Card
                                    key={character.id}
                                    variant="glass"
                                    className={`transition-all duration-300 hover:border-stone-gray ${character.isMain ? 'ring-2 ring-ancient-gold' : ''
                                        }`}
                                >
                                    <CardContent className="p-4 sm:p-5">
                                        <div className="flex items-start gap-3 sm:gap-4">
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

                                                <p className="text-xs sm:text-sm text-text-secondary mb-2">
                                                    Lv.{character.level} {character.race} {character.wowClass}
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

                                            {/* Actions - horizontal on mobile, vertical on larger */}
                                            <div className="flex sm:flex-col gap-1 sm:gap-2">
                                                {!character.isMain && (
                                                    <button
                                                        onClick={() => handleSetMain(character)}
                                                        className="p-2 rounded-lg hover:bg-obsidian-lighter text-text-muted 
                                                                 hover:text-ancient-gold transition-colors"
                                                        title="Set as main"
                                                    >
                                                        <Star className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setEditingCharacter(character)}
                                                    className="p-2 rounded-lg hover:bg-obsidian-lighter text-text-muted 
                                                               hover:text-text-primary transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setCharacterToDelete(character)}
                                                    disabled={deletingId === character.id}
                                                    className="p-2 rounded-lg hover:bg-hellfire-red/20 text-text-muted 
                                                               hover:text-hellfire-red transition-colors disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    {deletingId === character.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
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
                                         hover:border-fel-green hover:bg-fel-green/5 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-full bg-fel-green/20 flex items-center justify-center
                                              group-hover:bg-fel-green/30 transition-colors">
                                    <Plus className="w-6 h-6 text-fel-green" />
                                </div>
                                <span className="text-text-secondary group-hover:text-text-primary transition-colors">
                                    Add New Character
                                </span>
                            </button>
                        </div>
                    )}
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

            {/* Add Character Modal */}
            <AddCharacterModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onCharacterAdded={addCharacter}
                userId={user.id}
            />

            {/* Edit Character Modal */}
            {editingCharacter && (
                <EditCharacterModal
                    isOpen={!!editingCharacter}
                    onClose={() => setEditingCharacter(null)}
                    onCharacterUpdated={updateCharacter}
                    character={editingCharacter}
                />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmDeleteModal
                isOpen={!!characterToDelete}
                onClose={() => setCharacterToDelete(null)}
                onConfirm={handleDeleteCharacter}
                isDeleting={deletingId === characterToDelete?.id}
                characterName={characterToDelete?.name || ''}
            />
        </div>
    );
}
