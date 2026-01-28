import React from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'fel' | 'purple' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

export function Button({
    children,
    variant = 'fel',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'left',
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseClasses = `
    inline-flex items-center justify-center gap-2 font-semibold rounded-lg
    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
  `;

    const variantClasses = {
        fel: 'btn-fel',
        purple: 'btn-purple',
        outline: 'btn-outline',
        ghost: 'text-text-secondary hover:text-text-primary hover:bg-obsidian-lighter',
        danger: `
      bg-gradient-to-r from-hellfire-red to-hellfire-orange 
      text-white border border-hellfire-red
      hover:shadow-lg hover:shadow-hellfire-red/30
    `,
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <>
                    {icon && iconPosition === 'left' && icon}
                    {children}
                    {icon && iconPosition === 'right' && icon}
                </>
            )}
        </button>
    );
}

// Link styled as button
interface ButtonLinkProps {
    href: string;
    children: React.ReactNode;
    variant?: 'fel' | 'purple' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    className?: string;
    external?: boolean;
}

export function ButtonLink({
    href,
    children,
    variant = 'fel',
    size = 'md',
    icon,
    iconPosition = 'left',
    className = '',
    external = false,
}: ButtonLinkProps) {
    const baseClasses = `
    inline-flex items-center justify-center gap-2 font-semibold rounded-lg
    transition-all duration-200
  `;

    const variantClasses = {
        fel: 'btn-fel',
        purple: 'btn-purple',
        outline: 'btn-outline',
        ghost: 'text-text-secondary hover:text-text-primary hover:bg-obsidian-lighter px-4 py-2',
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5',
        lg: 'px-6 py-3 text-lg',
    };

    if (external) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            >
                {icon && iconPosition === 'left' && icon}
                {children}
                {icon && iconPosition === 'right' && icon}
            </a>
        );
    }

    return (
        <Link
            href={href}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        >
            {icon && iconPosition === 'left' && icon}
            {children}
            {icon && iconPosition === 'right' && icon}
        </Link>
    );
}
