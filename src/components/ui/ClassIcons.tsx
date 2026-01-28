'use client';

import React from 'react';
import { CLASS_COLORS } from '@/lib/constants';
import { WowClass, Role } from '@/lib/types';
import {
    Sword,
    Shield,
    Target,
    Eye,
    Cross,
    Zap,
    Snowflake,
    Flame,
    Leaf,
    Heart,
    Swords
} from 'lucide-react';

// Map class names to icons
const classIconMap: Record<WowClass, React.ElementType> = {
    Warrior: Sword,
    Paladin: Shield,
    Hunter: Target,
    Rogue: Eye,
    Priest: Cross,
    Shaman: Zap,
    Mage: Snowflake,
    Warlock: Flame,
    Druid: Leaf,
};

interface ClassIconProps {
    wowClass: WowClass;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export function ClassIcon({ wowClass, size = 'md', showLabel = false }: ClassIconProps) {
    const IconComponent = classIconMap[wowClass];
    const color = CLASS_COLORS[wowClass];

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    return (
        <div className="flex items-center gap-2">
            <div
                className={`flex items-center justify-center rounded ${size === 'lg' ? 'p-2' : 'p-1'
                    }`}
                style={{
                    backgroundColor: `${color}20`,
                    border: `1px solid ${color}40`
                }}
            >
                <IconComponent
                    className={sizeClasses[size]}
                    style={{ color }}
                />
            </div>
            {showLabel && (
                <span
                    className="font-medium text-sm"
                    style={{ color }}
                >
                    {wowClass}
                </span>
            )}
        </div>
    );
}

// Role icon component
interface RoleIconProps {
    role: Role;
    size?: 'sm' | 'md' | 'lg';
}

const roleIconMap: Record<Role, React.ElementType> = {
    Tank: Shield,
    Healer: Heart,
    DPS: Swords,
};

const roleColorMap: Record<Role, string> = {
    Tank: '#4a90d9',
    Healer: '#4aff4a',
    DPS: '#ff4a4a',
};

export function RoleIcon({ role, size = 'md' }: RoleIconProps) {
    const IconComponent = roleIconMap[role];
    const color = roleColorMap[role];

    const sizeClasses = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    };

    return (
        <IconComponent
            className={sizeClasses[size]}
            style={{ color }}
        />
    );
}

// Role badge component
interface RoleBadgeProps {
    role: Role;
}

export function RoleBadge({ role }: RoleBadgeProps) {
    const color = roleColorMap[role];

    return (
        <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
            style={{
                backgroundColor: `${color}20`,
                color: color,
                border: `1px solid ${color}40`
            }}
        >
            <RoleIcon role={role} size="sm" />
            {role}
        </span>
    );
}

// Class badge component
interface ClassBadgeProps {
    wowClass: WowClass;
}

export function ClassBadge({ wowClass }: ClassBadgeProps) {
    const color = CLASS_COLORS[wowClass];

    return (
        <span
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium"
            style={{
                backgroundColor: `${color}20`,
                color: color,
                border: `1px solid ${color}40`
            }}
        >
            {wowClass}
        </span>
    );
}
