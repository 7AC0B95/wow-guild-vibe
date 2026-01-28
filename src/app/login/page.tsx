'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { error } = await signIn(email, password);
            if (error) {
                setError(error.message);
            } else {
                router.push('/profile');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen portal-bg flex items-center justify-center px-4 py-20">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fel-green/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ethereal-purple/5 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                <Card variant="stone">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-fel-green via-ethereal-purple to-hellfire-orange p-0.5">
                            <div className="w-full h-full rounded-full bg-obsidian flex items-center justify-center">
                                <span className="text-2xl font-heading font-bold text-fel-green">D</span>
                            </div>
                        </div>
                        <CardTitle className="text-2xl">Welcome Back</CardTitle>
                        <CardDescription>
                            Sign in to access your guild portal
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Error Alert */}
                            {error && (
                                <div className="flex items-center gap-3 p-4 rounded-lg bg-hellfire-red/10 border border-hellfire-red/30">
                                    <AlertCircle className="w-5 h-5 text-hellfire-red flex-shrink-0" />
                                    <p className="text-sm text-hellfire-red">{error}</p>
                                </div>
                            )}

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-text-secondary">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-11 pr-4 py-3 rounded-lg bg-obsidian border border-stone-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-fel-green focus:ring-1 focus:ring-fel-green/50 transition-colors"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-11 pr-12 py-3 rounded-lg bg-obsidian border border-stone-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-fel-green focus:ring-1 focus:ring-fel-green/50 transition-colors"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Forgot Password Link */}
                            <div className="text-right">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-fel-green hover:underline"
                                >
                                    Forgot your password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                loading={loading}
                                className="w-full"
                                size="lg"
                            >
                                Sign In
                            </Button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="mt-6 pt-6 border-t border-stone-border text-center">
                            <p className="text-text-secondary">
                                Don't have an account?{' '}
                                <Link
                                    href="/signup"
                                    className="text-ethereal-purple hover:underline font-medium"
                                >
                                    Join the Guild
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Demo notice */}
                <p className="mt-4 text-center text-xs text-text-muted">
                    This is a demo. Configure Supabase in .env.local for full functionality.
                </p>
            </div>
        </div>
    );
}
