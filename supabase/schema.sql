-- WoW Guild Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Characters table
CREATE TABLE public.characters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    wow_class TEXT NOT NULL CHECK (wow_class IN ('Warrior', 'Paladin', 'Hunter', 'Rogue', 'Priest', 'Shaman', 'Mage', 'Warlock', 'Druid')),
    race TEXT NOT NULL CHECK (race IN ('Human', 'Dwarf', 'Night Elf', 'Gnome', 'Draenei', 'Orc', 'Undead', 'Tauren', 'Troll', 'Blood Elf')),
    role TEXT NOT NULL CHECK (role IN ('Tank', 'Healer', 'DPS')),
    faction TEXT NOT NULL CHECK (faction IN ('Alliance', 'Horde')),
    rank TEXT DEFAULT 'Member' CHECK (rank IN ('Guild Master', 'Officer', 'Raider', 'Trial', 'Member', 'Alt')),
    is_main BOOLEAN DEFAULT false,
    level INTEGER DEFAULT 70 CHECK (level >= 1 AND level <= 70),
    professions TEXT[] DEFAULT '{}',
    upgrades_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Raid Events table
CREATE TABLE public.raid_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    raid_instance TEXT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    max_tanks INTEGER DEFAULT 2,
    max_healers INTEGER DEFAULT 6,
    max_dps INTEGER DEFAULT 17,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event Signups table
CREATE TABLE public.event_signups (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES public.raid_events(id) ON DELETE CASCADE NOT NULL,
    character_id UUID REFERENCES public.characters(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Signed Up', 'Tentative', 'Absent')),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, character_id)
);

-- Forum Posts table
CREATE TABLE public.forum_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('General', 'Raiding', 'Professions', 'Loot')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    last_reply_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forum Replies table
CREATE TABLE public.forum_replies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_characters_user_id ON public.characters(user_id);
CREATE INDEX idx_characters_wow_class ON public.characters(wow_class);
CREATE INDEX idx_characters_rank ON public.characters(rank);
CREATE INDEX idx_raid_events_date ON public.raid_events(date);
CREATE INDEX idx_event_signups_event_id ON public.event_signups(event_id);
CREATE INDEX idx_event_signups_character_id ON public.event_signups(character_id);
CREATE INDEX idx_forum_posts_category ON public.forum_posts(category);
CREATE INDEX idx_forum_posts_author_id ON public.forum_posts(author_id);
CREATE INDEX idx_forum_replies_post_id ON public.forum_replies(post_id);

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raid_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Characters policies
CREATE POLICY "Characters are viewable by everyone" ON public.characters
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own characters" ON public.characters
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own characters" ON public.characters
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own characters" ON public.characters
    FOR DELETE USING (auth.uid() = user_id);

-- Raid Events policies
CREATE POLICY "Raid events are viewable by everyone" ON public.raid_events
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create events" ON public.raid_events
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Event creators can update their events" ON public.raid_events
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Event creators can delete their events" ON public.raid_events
    FOR DELETE USING (auth.uid() = created_by);

-- Event Signups policies
CREATE POLICY "Event signups are viewable by everyone" ON public.event_signups
    FOR SELECT USING (true);

CREATE POLICY "Users can signup with their characters" ON public.event_signups
    FOR INSERT WITH CHECK (
        auth.uid() = (SELECT user_id FROM public.characters WHERE id = character_id)
    );

CREATE POLICY "Users can update their own signups" ON public.event_signups
    FOR UPDATE USING (
        auth.uid() = (SELECT user_id FROM public.characters WHERE id = character_id)
    );

CREATE POLICY "Users can delete their own signups" ON public.event_signups
    FOR DELETE USING (
        auth.uid() = (SELECT user_id FROM public.characters WHERE id = character_id)
    );

-- Forum Posts policies
CREATE POLICY "Forum posts are viewable by everyone" ON public.forum_posts
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON public.forum_posts
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authors can update their posts" ON public.forum_posts
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their posts" ON public.forum_posts
    FOR DELETE USING (auth.uid() = author_id);

-- Forum Replies policies
CREATE POLICY "Forum replies are viewable by everyone" ON public.forum_replies
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create replies" ON public.forum_replies
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authors can update their replies" ON public.forum_replies
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their replies" ON public.forum_replies
    FOR DELETE USING (auth.uid() = author_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_characters_updated_at
    BEFORE UPDATE ON public.characters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at
    BEFORE UPDATE ON public.forum_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_replies_updated_at
    BEFORE UPDATE ON public.forum_replies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to increment reply count
CREATE OR REPLACE FUNCTION increment_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.forum_posts 
    SET reply_count = reply_count + 1,
        last_reply_at = NOW()
    WHERE id = NEW.post_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER increment_forum_reply_count
    AFTER INSERT ON public.forum_replies
    FOR EACH ROW
    EXECUTE FUNCTION increment_reply_count();

-- Function to decrement reply count
CREATE OR REPLACE FUNCTION decrement_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.forum_posts 
    SET reply_count = reply_count - 1
    WHERE id = OLD.post_id;
    RETURN OLD;
END;
$$ language 'plpgsql';

CREATE TRIGGER decrement_forum_reply_count
    AFTER DELETE ON public.forum_replies
    FOR EACH ROW
    EXECUTE FUNCTION decrement_reply_count();
