'use client';

import React from 'react';
import Link from 'next/link';
import {
    MessageCircle,
    Gamepad2,
    Heart,
    ExternalLink
} from 'lucide-react';

const footerLinks = {
    navigation: [
        { label: 'Home', href: '/' },
        { label: 'Roster', href: '/roster' },
        { label: 'Calendar', href: '/calendar' },
        { label: 'Forum', href: '/forum' },
    ],
    resources: [
        { label: 'Seventy Upgrades', href: 'https://seventyupgrades.com', external: true },
        { label: 'WoW Head TBC', href: 'https://tbc.wowhead.com', external: true },
        { label: 'Warcraft Logs', href: 'https://classic.warcraftlogs.com', external: true },
        { label: 'TBC DB', href: 'https://tbcdb.com', external: true },
    ],
    community: [
        { label: 'Discord', href: '#', icon: MessageCircle },
        { label: 'Join Us', href: '/signup' },
    ],
};

export default function Footer() {
    return (
        <footer className="relative bg-obsidian border-t border-stone-border">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-light/50 to-transparent pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-3 group mb-4">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-fel-green via-ethereal-purple to-hellfire-orange" />
                                <div className="absolute inset-1 bg-obsidian rounded-full flex items-center justify-center">
                                    <span className="text-fel-green font-heading text-xl font-bold">D</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="gothic-heading text-lg text-text-primary group-hover:text-fel-green transition-colors">
                                    Dark Portal
                                </h3>
                                <p className="text-xs text-text-muted">TBC Classic Guild</p>
                            </div>
                        </Link>
                        <p className="text-sm text-text-secondary leading-relaxed mb-4">
                            A dedicated community of adventurers conquering Outland together. Join us for epic raids,
                            lasting friendships, and memorable moments.
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="#"
                                className="p-2 rounded-lg bg-obsidian-lighter border border-stone-border hover:border-fel-green hover:text-fel-green transition-all"
                                aria-label="Discord"
                            >
                                <MessageCircle className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="p-2 rounded-lg bg-obsidian-lighter border border-stone-border hover:border-ethereal-purple hover:text-ethereal-purple transition-all"
                                aria-label="Game Info"
                            >
                                <Gamepad2 className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h4 className="gothic-heading text-sm text-fel-green mb-4">Navigation</h4>
                        <ul className="space-y-2">
                            {footerLinks.navigation.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="gothic-heading text-sm text-ethereal-purple mb-4">Resources</h4>
                        <ul className="space-y-2">
                            {footerLinks.resources.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-text-secondary hover:text-text-primary transition-colors inline-flex items-center gap-1"
                                    >
                                        {link.label}
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Raid Schedule Preview */}
                    <div>
                        <h4 className="gothic-heading text-sm text-ancient-gold mb-4">Raid Schedule</h4>
                        <div className="space-y-3">
                            <div className="p-3 rounded-lg bg-obsidian-lighter border border-stone-border">
                                <p className="text-sm font-medium text-text-primary">Karazhan</p>
                                <p className="text-xs text-text-muted">Wednesdays • 20:00 ST</p>
                            </div>
                            <div className="p-3 rounded-lg bg-obsidian-lighter border border-stone-border">
                                <p className="text-sm font-medium text-text-primary">25-Man Raids</p>
                                <p className="text-xs text-text-muted">Sundays • 19:00 ST</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-stone-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-text-muted text-center sm:text-left">
                        © 2026 Dark Portal Guild. World of Warcraft and related trademarks are property of Blizzard Entertainment.
                    </p>
                    <p className="text-xs text-text-muted flex items-center gap-1">
                        Made with <Heart className="w-3 h-3 text-hellfire-red" /> for the TBC community
                    </p>
                </div>
            </div>
        </footer>
    );
}
