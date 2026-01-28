'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Menu,
    X,
    Home,
    Users,
    Calendar,
    MessageSquare,
    User,
    LogIn,
    LogOut,
    ChevronDown
} from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';

const iconMap: Record<string, React.ElementType> = {
    Home,
    Users,
    Calendar,
    MessageSquare,
    User,
};

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const { user, signOut, loading } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const filteredNavItems = NAV_ITEMS.filter(item =>
        !item.requiresAuth || user
    );

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-obsidian/95 backdrop-blur-md shadow-lg shadow-black/30'
                : 'bg-transparent'
                }`}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-3 group"
                    >
                        {/* Dark Portal inspired logo mark */}
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-fel-green via-ethereal-purple to-hellfire-orange animate-spin-slow"
                                style={{ animationDuration: '8s' }} />
                            <div className="absolute inset-1 bg-obsidian rounded-full flex items-center justify-center">
                                <span className="text-fel-green font-heading text-lg font-bold">D</span>
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="gothic-heading text-lg text-text-primary group-hover:text-fel-green transition-colors">
                                Dark Portal
                            </h1>
                            <p className="text-xs text-text-muted -mt-1">TBC Guild</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        {filteredNavItems.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/' && pathname.startsWith(item.href));

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`nav-link text-sm font-medium transition-colors ${isActive
                                        ? 'text-fel-green'
                                        : 'text-text-secondary hover:text-text-primary'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Auth Buttons - Desktop */}
                    <div className="hidden lg:flex items-center gap-4">
                        {loading ? (
                            <div className="w-24 h-10 skeleton rounded-lg" />
                        ) : user ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fel-green to-ethereal-purple flex items-center justify-center">
                                        <span className="text-xs font-bold text-white">
                                            {user.email?.[0].toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="hidden xl:inline">{user.email?.split('@')[0]}</span>
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="btn-outline text-sm flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login" className="btn-outline text-sm">
                                    Sign In
                                </Link>
                                <Link href="/signup" className="btn-fel text-sm">
                                    Join Guild
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 text-text-primary hover:text-fel-green transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden fixed inset-0 top-16 z-50" style={{ backgroundColor: '#0a0a0f' }}>
                    <div className="flex flex-col h-full px-6 py-8">
                        {/* Navigation Links */}
                        <nav className="flex flex-col gap-2">
                            {filteredNavItems.map((item) => {
                                const isActive = pathname === item.href ||
                                    (item.href !== '/' && pathname.startsWith(item.href));
                                const IconComponent = iconMap[item.label] || Home;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-4 p-4 rounded-lg transition-all ${isActive
                                            ? 'bg-fel-green/10 text-fel-green border border-fel-green/30'
                                            : 'text-text-secondary hover:bg-obsidian-lighter hover:text-text-primary'
                                            }`}
                                    >
                                        <IconComponent className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Divider */}
                        <div className="h-px bg-stone-border my-6" />

                        {/* Auth Section - Mobile */}
                        <div className="mt-auto">
                            {loading ? (
                                <div className="w-full h-12 skeleton rounded-lg" />
                            ) : user ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 rounded-lg bg-obsidian-lighter">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fel-green to-ethereal-purple flex items-center justify-center">
                                            <span className="text-sm font-bold text-white">
                                                {user.email?.[0].toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-text-primary">{user.email?.split('@')[0]}</p>
                                            <p className="text-xs text-text-muted">{user.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full btn-outline flex items-center justify-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link href="/signup" className="btn-fel text-center">
                                        Join Guild
                                    </Link>
                                    <Link href="/login" className="btn-outline text-center">
                                        Sign In
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Guild info footer */}
                        <div className="mt-8 pt-6 border-t border-stone-border">
                            <p className="text-xs text-text-muted text-center">
                                © 2024 Dark Portal Guild • The Burning Crusade Classic
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
