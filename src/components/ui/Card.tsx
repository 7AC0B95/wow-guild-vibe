import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'glass' | 'stone';
    hover?: boolean;
}

export function Card({
    children,
    className = '',
    variant = 'default',
    hover = false
}: CardProps) {
    const baseClasses = 'rounded-xl overflow-hidden';

    const variantClasses = {
        default: 'bg-obsidian-light border border-stone-border',
        glass: 'glass-card',
        stone: 'stone-border bg-obsidian-light',
    };

    const hoverClasses = hover ? 'hover-lift cursor-pointer' : '';

    return (
        <div className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}>
            {children}
        </div>
    );
}

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
    return (
        <div className={`p-4 sm:p-6 border-b border-stone-border ${className}`}>
            {children}
        </div>
    );
}

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
    return (
        <div className={`p-4 sm:p-6 ${className}`}>
            {children}
        </div>
    );
}

interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
    return (
        <div className={`p-4 sm:p-6 border-t border-stone-border bg-obsidian/50 ${className}`}>
            {children}
        </div>
    );
}

interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4';
}

export function CardTitle({ children, className = '', as: Tag = 'h3' }: CardTitleProps) {
    return (
        <Tag className={`gothic-heading text-lg sm:text-xl text-text-primary ${className}`}>
            {children}
        </Tag>
    );
}

interface CardDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
    return (
        <p className={`text-sm text-text-secondary mt-1 ${className}`}>
            {children}
        </p>
    );
}
