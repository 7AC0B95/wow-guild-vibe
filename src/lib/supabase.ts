import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type-safe database types (to be generated from Supabase)
export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    email: string;
                    display_name: string;
                    avatar_url: string | null;
                    created_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    display_name: string;
                    avatar_url?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    display_name?: string;
                    avatar_url?: string | null;
                    created_at?: string;
                };
            };
            characters: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    wow_class: string;
                    race: string;
                    role: string;
                    faction: string;
                    rank: string;
                    is_main: boolean;
                    level: number;
                    professions: string[];
                    upgrades_url: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    wow_class: string;
                    race: string;
                    role: string;
                    faction: string;
                    rank?: string;
                    is_main?: boolean;
                    level?: number;
                    professions?: string[];
                    upgrades_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    name?: string;
                    wow_class?: string;
                    race?: string;
                    role?: string;
                    faction?: string;
                    rank?: string;
                    is_main?: boolean;
                    level?: number;
                    professions?: string[];
                    upgrades_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            raid_events: {
                Row: {
                    id: string;
                    title: string;
                    description: string | null;
                    raid_instance: string;
                    date: string;
                    start_time: string;
                    end_time: string | null;
                    max_tanks: number;
                    max_healers: number;
                    max_dps: number;
                    created_by: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    description?: string | null;
                    raid_instance: string;
                    date: string;
                    start_time: string;
                    end_time?: string | null;
                    max_tanks?: number;
                    max_healers?: number;
                    max_dps?: number;
                    created_by: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    description?: string | null;
                    raid_instance?: string;
                    date?: string;
                    start_time?: string;
                    end_time?: string | null;
                    max_tanks?: number;
                    max_healers?: number;
                    max_dps?: number;
                    created_by?: string;
                    created_at?: string;
                };
            };
            event_signups: {
                Row: {
                    id: string;
                    event_id: string;
                    character_id: string;
                    status: string;
                    note: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    event_id: string;
                    character_id: string;
                    status: string;
                    note?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    event_id?: string;
                    character_id?: string;
                    status?: string;
                    note?: string | null;
                    created_at?: string;
                };
            };
            forum_posts: {
                Row: {
                    id: string;
                    category: string;
                    title: string;
                    content: string;
                    author_id: string;
                    is_pinned: boolean;
                    is_locked: boolean;
                    view_count: number;
                    reply_count: number;
                    last_reply_at: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    category: string;
                    title: string;
                    content: string;
                    author_id: string;
                    is_pinned?: boolean;
                    is_locked?: boolean;
                    view_count?: number;
                    reply_count?: number;
                    last_reply_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    category?: string;
                    title?: string;
                    content?: string;
                    author_id?: string;
                    is_pinned?: boolean;
                    is_locked?: boolean;
                    view_count?: number;
                    reply_count?: number;
                    last_reply_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            forum_replies: {
                Row: {
                    id: string;
                    post_id: string;
                    content: string;
                    author_id: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    post_id: string;
                    content: string;
                    author_id: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    post_id?: string;
                    content?: string;
                    author_id?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
        };
    };
};
