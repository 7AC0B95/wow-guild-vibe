'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';

export default function SignUpPage() {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const router = useRouter();

    // Password requirements
    const passwordRequirements = [
        { label: 'At least 8 characters', met: password.length >= 8 },
        { label: 'Contains a number', met: /\d/.test(password) },
        { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    ];

    const allRequirementsMet = passwordRequirements.every((req) => req.met);
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!allRequirementsMet) {
            setError('Please meet all password requirements');
            return;
        }

        if (!passwordsMatch) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const { error } = await signUp(email, password, displayName);
            if (error) {
                setError(error.message);
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen portal-bg flex items-center justify-center px-4 py-20">
                <Card variant="stone" className="max-w-md w-full">
                    <CardContent className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-fel-green/20 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-fel-green" />
                        </div>
                        <h2 className="gothic-heading text-2xl text-text-primary mb-4">
                            Welcome to the Guild!
                        </h2>
                        <p className="text-text-secondary mb-6">
                            Check your email for a confirmation link to activate your account.
                        </p>
                        <Link href="/login" className="btn-fel inline-block">
                            Go to Login
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen portal-bg flex items-center justify-center px-4 py-20">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ethereal-purple/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fel-green/5 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                <Card variant="stone">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-fel-green via-ethereal-purple to-hellfire-orange p-0.5">
                            <div className="w-full h-full rounded-full bg-obsidian flex items-center justify-center">
                                <span className="text-2xl font-heading font-bold text-fel-green">D</span>
                            </div>
                        </div>
                        <CardTitle className="text-2xl">Join the Guild</CardTitle>
                        <CardDescription>
                            Create your account and start your adventure
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

                            {/* Display Name Field */}
                            <div className="space-y-2">
                                <label htmlFor="displayName" className="block text-sm font-medium text-text-secondary">
                                    Display Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                    <input
                                        id="displayName"
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        required
                                        className="w-full pl-11 pr-4 py-3 rounded-lg bg-obsidian border border-stone-border 
                               text-text-primary placeholder:text-text-muted
                               focus:outline-none focus:border-fel-green focus:ring-1 focus:ring-fel-green/50
                               transition-colors"
                                        placeholder="Your character or nickname"
                                    />
                                </div>
                            </div>

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
                                        className="w-full pl-11 pr-4 py-3 rounded-lg bg-obsidian border border-stone-border 
                               text-text-primary placeholder:text-text-muted
                               focus:outline-none focus:border-fel-green focus:ring-1 focus:ring-fel-green/50
                               transition-colors"
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
                                        className="w-full pl-11 pr-12 py-3 rounded-lg bg-obsidian border border-stone-border 
                               text-text-primary placeholder:text-text-muted
                               focus:outline-none focus:border-fel-green focus:ring-1 focus:ring-fel-green/50
                               transition-colors"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted 
                               hover:text-text-primary transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>

                                {/* Password Requirements */}
                                {password.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        {passwordRequirements.map((req) => (
                                            <div
                                                key={req.label}
                                                className={`flex items-center gap-2 text-xs ${req.met ? 'text-fel-green' : 'text-text-muted'
                                                    }`}
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-full ${req.met ? 'bg-fel-green' : 'bg-text-muted'
                                                    }`} />
                                                {req.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                    <input
                                        id="confirmPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className={`w-full pl-11 pr-12 py-3 rounded-lg bg-obsidian border 
                               text-text-primary placeholder:text-text-muted
                               focus:outline-none focus:ring-1 transition-colors ${confirmPassword.length > 0
                                                ? passwordsMatch
                                                    ? 'border-fel-green focus:border-fel-green focus:ring-fel-green/50'
                                                    : 'border-hellfire-red focus:border-hellfire-red focus:ring-hellfire-red/50'
                                                : 'border-stone-border focus:border-fel-green focus:ring-fel-green/50'
                                            }`}
                                        placeholder="••••••••"
                                    />
                                    {confirmPassword.length > 0 && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {passwordsMatch ? (
                                                <CheckCircle className="w-5 h-5 text-fel-green" />
                                            ) : (
                                                <AlertCircle className="w-5 h-5 text-hellfire-red" />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                loading={loading}
                                className="w-full"
                                size="lg"
                            >
                                Create Account
                            </Button>

                            {/* Terms */}
                            <p className="text-xs text-text-muted text-center">
                                By creating an account, you agree to our{' '}
                                <Link href="/terms" className="text-fel-green hover:underline">Terms</Link>
                                {' '}and{' '}
                                <Link href="/privacy" className="text-fel-green hover:underline">Privacy Policy</Link>
                            </p>
                        </form>

                        {/* Sign In Link */}
                        <div className="mt-6 pt-6 border-t border-stone-border text-center">
                            <p className="text-text-secondary">
                                Already have an account?{' '}
                                <Link
                                    href="/login"
                                    className="text-ethereal-purple hover:underline font-medium"
                                >
                                    Sign In
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
