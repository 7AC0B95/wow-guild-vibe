'use client';

import React from 'react';
import Link from 'next/link';
import {
    Users,
    Calendar,
    MessageSquare,
    Shield,
    Swords,
    ChevronRight,
    Star,
    Clock,
    Trophy
} from 'lucide-react';
import { ButtonLink } from '@/components/ui';
import { Card, CardContent } from '@/components/ui';

// Feature cards data
const features = [
    {
        icon: Users,
        title: 'Guild Roster',
        description: 'View all guild members with class-based filtering and rank display. Track your fellow raiders.',
        color: '#32CD32',
        href: '/roster',
    },
    {
        icon: Calendar,
        title: 'Raid Calendar',
        description: 'Interactive raid scheduling with sign-ups. Never miss a raid with role tracking and notifications.',
        color: '#9945FF',
        href: '/calendar',
    },
    {
        icon: MessageSquare,
        title: 'Guild Forum',
        description: 'Discuss strategies, share loot, and connect with guildies. Full Markdown and item linking support.',
        color: '#FFD700',
        href: '/forum',
    },
    {
        icon: Shield,
        title: 'Character Profiles',
        description: 'Manage multiple characters with gear links, professions, and role assignments.',
        color: '#FF4500',
        href: '/profile',
    },
];

// Raid progress mock data
const raidProgress = [
    { name: 'Karazhan', progress: '11/11', status: 'cleared' },
    { name: 'Gruul\'s Lair', progress: '2/2', status: 'cleared' },
    { name: 'Magtheridon\'s Lair', progress: '1/1', status: 'cleared' },
    { name: 'Serpentshrine Cavern', progress: '4/6', status: 'progress' },
    { name: 'Tempest Keep', progress: '2/4', status: 'progress' },
];

// Upcoming raids mock data
const upcomingRaids = [
    { name: 'Karazhan', date: 'Wednesday', time: '20:00 ST', spots: 2 },
    { name: 'SSC/TK', date: 'Sunday', time: '19:00 ST', spots: 5 },
    { name: 'Gruul + Mag', date: 'Thursday', time: '21:00 ST', spots: 8 },
];

export default function HeroSection() {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="relative min-h-screen portal-bg overflow-hidden">
            {/* Animated particles - Only render on client to avoid hydration mismatch */}
            {mounted && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 rounded-full bg-fel-green/60"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 120}%`,
                                animation: `floatParticle ${8 + Math.random() * 12}s linear infinite`,
                                animationDelay: `${-Math.random() * 20}s`,
                            }}
                        />
                    ))}
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={`purple-${i}`}
                            className="absolute w-1.5 h-1.5 rounded-full bg-ethereal-purple/40"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 120}%`,
                                animation: `floatParticle ${10 + Math.random() * 15}s linear infinite`,
                                animationDelay: `${-Math.random() * 25}s`,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Hero Content */}
                        <div className="text-center lg:text-left">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fel-green/10 border border-fel-green/30 mb-6">
                                <div className="w-2 h-2 rounded-full bg-fel-green animate-pulse" />
                                <span className="text-sm text-fel-green font-medium">
                                    Now Recruiting: Warlocks & Shadow Priests
                                </span>
                            </div>

                            {/* Main Heading */}
                            <h1 className="gothic-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-text-primary leading-tight mb-6">
                                Step Through{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fel-green via-ethereal-purple to-hellfire-orange">
                                    The Dark Portal
                                </span>
                            </h1>

                            {/* Subtitle */}
                            <p className="text-lg sm:text-xl text-text-secondary max-w-xl mx-auto lg:mx-0 mb-8">
                                Join our dedicated TBC Classic guild as we conquer Outland together.
                                Epic raids, lasting friendships, and legendary loot await.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <ButtonLink
                                    href="/signup"
                                    size="lg"
                                    icon={<Swords className="w-5 h-5" />}
                                >
                                    Join the Guild
                                </ButtonLink>
                                <ButtonLink
                                    href="/roster"
                                    variant="outline"
                                    size="lg"
                                    icon={<ChevronRight className="w-5 h-5" />}
                                    iconPosition="right"
                                >
                                    View Roster
                                </ButtonLink>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-stone-border">
                                <div className="text-center lg:text-left">
                                    <p className="text-2xl sm:text-3xl font-bold text-fel-green">50+</p>
                                    <p className="text-sm text-text-muted">Active Raiders</p>
                                </div>
                                <div className="text-center lg:text-left">
                                    <p className="text-2xl sm:text-3xl font-bold text-ethereal-purple">100%</p>
                                    <p className="text-sm text-text-muted">T4 Cleared</p>
                                </div>
                                <div className="text-center lg:text-left">
                                    <p className="text-2xl sm:text-3xl font-bold text-ancient-gold">2+</p>
                                    <p className="text-sm text-text-muted">Years Running</p>
                                </div>
                            </div>
                        </div>

                        {/* Hero Card - Raid Progress & Schedule */}
                        <div className="relative">
                            {/* Glow effect behind card */}
                            <div className="absolute inset-0 blur-3xl opacity-20">
                                <div className="absolute inset-0 bg-gradient-to-br from-fel-green via-ethereal-purple to-hellfire-orange" />
                            </div>

                            <Card variant="stone" className="relative">
                                <div className="p-6 border-b border-stone-border">
                                    <div className="flex items-center justify-between">
                                        <h3 className="gothic-heading text-lg text-text-primary flex items-center gap-2">
                                            <Trophy className="w-5 h-5 text-ancient-gold" />
                                            Raid Progress
                                        </h3>
                                        <span className="text-xs text-text-muted">Season 2</span>
                                    </div>
                                </div>

                                <CardContent className="space-y-3">
                                    {raidProgress.map((raid) => (
                                        <div
                                            key={raid.name}
                                            className="flex items-center justify-between p-3 rounded-lg bg-obsidian/50"
                                        >
                                            <span className="text-sm text-text-primary">{raid.name}</span>
                                            <span className={`text-sm font-medium ${raid.status === 'cleared' ? 'text-fel-green' : 'text-ancient-gold'
                                                }`}>
                                                {raid.progress}
                                            </span>
                                        </div>
                                    ))}
                                </CardContent>

                                <div className="p-6 border-t border-stone-border bg-obsidian/30">
                                    <h4 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Upcoming Raids
                                    </h4>
                                    <div className="space-y-2">
                                        {upcomingRaids.map((raid, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between text-sm"
                                            >
                                                <div>
                                                    <span className="text-text-primary">{raid.name}</span>
                                                    <span className="text-text-muted ml-2">{raid.date}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-text-muted">{raid.time}</span>
                                                    <span className="px-2 py-0.5 rounded bg-ethereal-purple/20 text-ethereal-purple text-xs">
                                                        {raid.spots} spots
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-obsidian-light/50">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <h2 className="gothic-heading text-3xl sm:text-4xl text-text-primary mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-text-secondary max-w-2xl mx-auto">
                            Our guild portal provides all the tools you need to coordinate raids,
                            manage your characters, and connect with fellow adventurers.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature) => {
                            const IconComponent = feature.icon;
                            return (
                                <Link
                                    key={feature.title}
                                    href={feature.href}
                                    className="group"
                                >
                                    <Card
                                        variant="glass"
                                        hover
                                        className="h-full transition-all duration-300 group-hover:border-opacity-100"
                                        style={{
                                            borderColor: `${feature.color}40`,
                                            '--feature-color': feature.color,
                                        } as React.CSSProperties}
                                    >
                                        <CardContent className="text-center p-8">
                                            <div
                                                className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                                                style={{
                                                    backgroundColor: `${feature.color}15`,
                                                    border: `1px solid ${feature.color}30`
                                                }}
                                            >
                                                <IconComponent
                                                    className="w-7 h-7"
                                                    style={{ color: feature.color }}
                                                />
                                            </div>
                                            <h3
                                                className="gothic-heading text-lg text-text-primary mb-2 transition-colors group-hover:[color:var(--feature-color)]"
                                            >
                                                {feature.title}
                                            </h3>
                                            <p className="text-sm text-text-secondary">
                                                {feature.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="relative p-8 sm:p-12 rounded-2xl overflow-hidden">
                        {/* Background effects */}
                        <div className="absolute inset-0 bg-gradient-to-r from-fel-green/10 via-ethereal-purple/10 to-hellfire-orange/10" />
                        <div className="absolute inset-0 stone-border opacity-50" />

                        <div className="relative">
                            <Star className="w-12 h-12 mx-auto mb-6 text-ancient-gold" />
                            <h2 className="gothic-heading text-3xl sm:text-4xl text-text-primary mb-4">
                                Ready to Join the Adventure?
                            </h2>
                            <p className="text-text-secondary max-w-xl mx-auto mb-8">
                                Whether you're a seasoned raider or just starting your journey through the Dark Portal,
                                we welcome all dedicated players to our ranks.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <ButtonLink href="/signup" size="lg">
                                    Apply Now
                                </ButtonLink>
                                <ButtonLink href="/forum" variant="outline" size="lg">
                                    Read Our Guidelines
                                </ButtonLink>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
