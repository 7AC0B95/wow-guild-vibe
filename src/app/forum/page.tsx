'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    MessageSquare,
    Swords,
    Hammer,
    Gift,
    Pin,
    Lock,
    Clock,
    Eye,
    MessageCircle,
    Plus,
    Search,
    ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, Button } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { ForumCategory } from '@/lib/types';
import { FORUM_CATEGORIES } from '@/lib/constants';
import { formatDistanceToNow } from 'date-fns';

// Icon mapping
const categoryIcons: Record<ForumCategory, React.ElementType> = {
    General: MessageSquare,
    Raiding: Swords,
    Professions: Hammer,
    Loot: Gift,
};

// Mock forum data
const mockPosts = [
    {
        id: '1',
        category: 'General' as ForumCategory,
        title: 'Welcome to Dark Portal Guild!',
        content: 'Welcome all new members...',
        authorName: 'Artherius',
        authorClass: 'Warrior',
        isPinned: true,
        isLocked: false,
        viewCount: 245,
        replyCount: 12,
        lastReplyAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    },
    {
        id: '2',
        category: 'Raiding' as ForumCategory,
        title: 'Phase 3 Preparation - SSC/TK Guide',
        content: 'Here are the strategies we will be using...',
        authorName: 'Moonweaver',
        authorClass: 'Druid',
        isPinned: true,
        isLocked: false,
        viewCount: 189,
        replyCount: 34,
        lastReplyAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    },
    {
        id: '3',
        category: 'Loot' as ForumCategory,
        title: 'Loot Council Policy Update',
        content: 'We are updating our loot distribution system...',
        authorName: 'Artherius',
        authorClass: 'Warrior',
        isPinned: false,
        isLocked: false,
        viewCount: 156,
        replyCount: 28,
        lastReplyAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    },
    {
        id: '4',
        category: 'Professions' as ForumCategory,
        title: 'LF Enchanter for Ring Spellpower',
        content: 'Anyone have the enchant? I have mats...',
        authorName: 'Frostbolt',
        authorClass: 'Mage',
        isPinned: false,
        isLocked: false,
        viewCount: 34,
        replyCount: 5,
        lastReplyAt: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    },
    {
        id: '5',
        category: 'Raiding' as ForumCategory,
        title: 'Looking for more DPS for Sunday',
        content: 'We need 2 more ranged DPS for this Sunday run...',
        authorName: 'Lightbringer',
        authorClass: 'Paladin',
        isPinned: false,
        isLocked: false,
        viewCount: 67,
        replyCount: 8,
        lastReplyAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
    {
        id: '6',
        category: 'General' as ForumCategory,
        title: 'Screenshot Thread - Share your epic moments!',
        content: 'Post your best screenshots from raids...',
        authorName: 'Shadowstrike',
        authorClass: 'Rogue',
        isPinned: false,
        isLocked: false,
        viewCount: 412,
        replyCount: 89,
        lastReplyAt: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 14 days ago
    },
];

// Class colors for author names
const classColors: Record<string, string> = {
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

export default function ForumPage() {
    const [selectedCategory, setSelectedCategory] = useState<ForumCategory | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth();

    // Filter posts
    const filteredPosts = mockPosts
        .filter((post) => {
            const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
            const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.authorName.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        })
        .sort((a, b) => {
            // Pinned posts first
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            // Then by last reply date
            return b.lastReplyAt.getTime() - a.lastReplyAt.getTime();
        });

    const categories = Object.keys(FORUM_CATEGORIES) as ForumCategory[];

    return (
        <div className="min-h-screen portal-bg pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="gothic-heading text-4xl text-text-primary mb-2 flex items-center gap-3">
                            <MessageSquare className="w-10 h-10 text-ancient-gold" />
                            Guild Forum
                        </h1>
                        <p className="text-text-secondary">
                            Discuss strategies, share knowledge, and connect with guildies
                        </p>
                    </div>
                    {user && (
                        <Button icon={<Plus className="w-4 h-4" />}>
                            New Topic
                        </Button>
                    )}
                </div>

                {/* Category Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {categories.map((category) => {
                        const IconComponent = categoryIcons[category];
                        const catInfo = FORUM_CATEGORIES[category];
                        const postCount = mockPosts.filter((p) => p.category === category).length;
                        const isActive = selectedCategory === category;

                        return (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(isActive ? 'all' : category)}
                                className={`text-left transition-all duration-300 ${isActive ? 'scale-[1.02]' : ''
                                    }`}
                            >
                                <Card
                                    variant="glass"
                                    className={`h-full transition-all duration-300 ${isActive ? 'border-2' : ''
                                        }`}
                                    style={{
                                        borderColor: isActive ? catInfo.color : undefined
                                    } as React.CSSProperties}
                                >
                                    <CardContent className="p-5">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                                            style={{
                                                backgroundColor: `${catInfo.color}20`,
                                                border: `1px solid ${catInfo.color}40`
                                            }}
                                        >
                                            <IconComponent
                                                className="w-6 h-6"
                                                style={{ color: catInfo.color }}
                                            />
                                        </div>
                                        <h3 className="font-semibold text-text-primary mb-1">{category}</h3>
                                        <p className="text-xs text-text-muted mb-2">{catInfo.description}</p>
                                        <p className="text-sm text-text-secondary">
                                            {postCount} {postCount === 1 ? 'topic' : 'topics'}
                                        </p>
                                    </CardContent>
                                </Card>
                            </button>
                        );
                    })}
                </div>

                {/* Search and Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search topics..."
                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-obsidian-light border border-stone-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-fel-green focus:ring-1 focus:ring-fel-green/50 transition-colors"
                        />
                    </div>
                    {selectedCategory !== 'all' && (
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className="px-4 py-2 rounded-lg bg-obsidian-light border border-stone-border text-text-secondary hover:text-text-primary transition-colors"
                        >
                            Clear Filter
                        </button>
                    )}
                </div>

                {/* Topics List */}
                <Card variant="stone">
                    <CardHeader className="hidden sm:grid grid-cols-12 gap-4 text-sm text-text-muted">
                        <div className="col-span-6">Topic</div>
                        <div className="col-span-2 text-center">Replies</div>
                        <div className="col-span-2 text-center">Views</div>
                        <div className="col-span-2 text-right">Last Reply</div>
                    </CardHeader>

                    <div className="divide-y divide-stone-border">
                        {filteredPosts.map((post) => {
                            const IconComponent = categoryIcons[post.category];
                            const catInfo = FORUM_CATEGORIES[post.category];

                            return (
                                <Link
                                    key={post.id}
                                    href={`/forum/${post.id}`}
                                    className="block p-4 sm:p-5 hover:bg-obsidian-lighter transition-colors"
                                >
                                    <div className="sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center">
                                        {/* Topic Info */}
                                        <div className="sm:col-span-6 mb-3 sm:mb-0">
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                                    style={{
                                                        backgroundColor: `${catInfo.color}20`,
                                                    }}
                                                >
                                                    <IconComponent
                                                        className="w-5 h-5"
                                                        style={{ color: catInfo.color }}
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {post.isPinned && (
                                                            <Pin className="w-4 h-4 text-ancient-gold flex-shrink-0" />
                                                        )}
                                                        {post.isLocked && (
                                                            <Lock className="w-4 h-4 text-text-muted flex-shrink-0" />
                                                        )}
                                                        <h3 className="font-medium text-text-primary truncate hover:text-fel-green transition-colors">
                                                            {post.title}
                                                        </h3>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span
                                                            className="font-medium"
                                                            style={{ color: classColors[post.authorClass] }}
                                                        >
                                                            {post.authorName}
                                                        </span>
                                                        <span className="text-text-muted">•</span>
                                                        <span className="text-text-muted text-xs">
                                                            {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Replies */}
                                        <div className="hidden sm:flex sm:col-span-2 items-center justify-center gap-1 text-text-secondary">
                                            <MessageCircle className="w-4 h-4" />
                                            <span>{post.replyCount}</span>
                                        </div>

                                        {/* Views */}
                                        <div className="hidden sm:flex sm:col-span-2 items-center justify-center gap-1 text-text-secondary">
                                            <Eye className="w-4 h-4" />
                                            <span>{post.viewCount}</span>
                                        </div>

                                        {/* Last Reply */}
                                        <div className="hidden sm:flex sm:col-span-2 items-center justify-end gap-1 text-sm text-text-muted">
                                            <Clock className="w-4 h-4" />
                                            <span>{formatDistanceToNow(post.lastReplyAt, { addSuffix: true })}</span>
                                        </div>

                                        {/* Mobile stats */}
                                        <div className="sm:hidden flex items-center gap-4 mt-2 text-xs text-text-muted">
                                            <span className="flex items-center gap-1">
                                                <MessageCircle className="w-3 h-3" />
                                                {post.replyCount}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                {post.viewCount}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatDistanceToNow(post.lastReplyAt, { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </Card>

                {/* Empty State */}
                {filteredPosts.length === 0 && (
                    <div className="text-center py-16">
                        <MessageSquare className="w-16 h-16 mx-auto text-text-muted mb-4" />
                        <h3 className="text-xl font-medium text-text-primary mb-2">No topics found</h3>
                        <p className="text-text-secondary mb-4">
                            {selectedCategory !== 'all'
                                ? `No topics in ${selectedCategory} category yet.`
                                : 'Be the first to start a discussion!'}
                        </p>
                        {user && (
                            <Button icon={<Plus className="w-4 h-4" />}>
                                Create Topic
                            </Button>
                        )}
                    </div>
                )}

                {/* Pagination placeholder */}
                {filteredPosts.length > 0 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <button className="p-2 rounded-lg bg-fel-green text-white font-medium">1</button>
                        <button className="p-2 rounded-lg hover:bg-obsidian-lighter text-text-secondary">2</button>
                        <button className="p-2 rounded-lg hover:bg-obsidian-lighter text-text-secondary">3</button>
                        <span className="text-text-muted">...</span>
                        <button className="p-2 rounded-lg hover:bg-obsidian-lighter text-text-secondary flex items-center gap-1">
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
