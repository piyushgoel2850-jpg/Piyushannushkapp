/*
# PassionSphere Database Schema

1. New Tables
- `profiles` - User profiles with interests, XP, and gamification data
- `interests` - Available interest categories
- `user_interests` - Junction table for user-interest relationships with skill levels
- `communities` - Interest-based communities
- `community_members` - Junction for community membership
- `quests` - Quests/missions for each interest
- `user_quests` - User quest progress tracking
- `events` - Real-world and virtual events
- `event_attendees` - Event RSVP tracking
- `posts` - Community posts
- `messages` - Direct messages between users
- `leaderboard` - Weekly/monthly XP rankings
- `reports` - User-generated content reports

2. Security
- Enable RLS on all tables
- Owner-scoped policies for user data
- Public read policies for communities, quests, events
*/

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  username text UNIQUE,
  bio text,
  location text,
  avatar_url text,
  xp_points integer NOT NULL DEFAULT 0,
  reputation_score decimal(3,2) DEFAULT 5.00,
  verification_status text DEFAULT 'unverified',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Interests table
CREATE TABLE IF NOT EXISTS interests (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  description text,
  icon text,
  color text,
  sub_interests text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- User interests junction
CREATE TABLE IF NOT EXISTS user_interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  interest_id text NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
  skill_level text NOT NULL DEFAULT 'Beginner',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, interest_id)
);

-- Communities table
CREATE TABLE IF NOT EXISTS communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  interest_id text NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
  creator_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  member_count integer NOT NULL DEFAULT 0,
  icon text,
  color text,
  created_at timestamptz DEFAULT now()
);

-- Community members junction
CREATE TABLE IF NOT EXISTS community_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  joined_at timestamptz DEFAULT now(),
  UNIQUE(community_id, user_id)
);

-- Quests table
CREATE TABLE IF NOT EXISTS quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  interest_id text NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
  difficulty text NOT NULL DEFAULT 'Easy',
  xp_reward integer NOT NULL DEFAULT 0,
  badge_reward text,
  steps text[] DEFAULT '{}',
  completed_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- User quest progress
CREATE TABLE IF NOT EXISTS user_quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quest_id uuid NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'in_progress',
  completed_steps integer[] DEFAULT '{}',
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(user_id, quest_id)
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date date NOT NULL,
  time text,
  venue text,
  category text,
  capacity integer,
  organizer_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  interest_id text REFERENCES interests(id) ON DELETE SET NULL,
  lat decimal(10,8),
  lng decimal(11,8),
  created_at timestamptz DEFAULT now()
);

-- Event attendees
CREATE TABLE IF NOT EXISTS event_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'going',
  rsvp_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  content text NOT NULL,
  media_urls text[] DEFAULT '{}',
  likes_count integer NOT NULL DEFAULT 0,
  comments_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  media_url text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reported_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- User interests policies
DROP POLICY IF EXISTS "select_own_interests" ON user_interests;
CREATE POLICY "select_own_interests" ON user_interests FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_interests" ON user_interests;
CREATE POLICY "insert_own_interests" ON user_interests FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_interests" ON user_interests;
CREATE POLICY "update_own_interests" ON user_interests FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_interests" ON user_interests;
CREATE POLICY "delete_own_interests" ON user_interests FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Communities policies (public read, owner can modify)
DROP POLICY IF EXISTS "select_communities" ON communities;
CREATE POLICY "select_communities" ON communities FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_communities" ON communities;
CREATE POLICY "insert_communities" ON communities FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = creator_id);

DROP POLICY IF EXISTS "update_own_communities" ON communities;
CREATE POLICY "update_own_communities" ON communities FOR UPDATE
  TO authenticated USING (auth.uid() = creator_id) WITH CHECK (auth.uid() = creator_id);

-- Community members policies
DROP POLICY IF EXISTS "select_community_members" ON community_members;
CREATE POLICY "select_community_members" ON community_members FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_membership" ON community_members;
CREATE POLICY "insert_own_membership" ON community_members FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_membership" ON community_members;
CREATE POLICY "delete_own_membership" ON community_members FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Quests policies (public read)
DROP POLICY IF EXISTS "select_quests" ON quests;
CREATE POLICY "select_quests" ON quests FOR SELECT
  TO authenticated USING (true);

-- User quests policies
DROP POLICY IF EXISTS "select_own_quests" ON user_quests;
CREATE POLICY "select_own_quests" ON user_quests FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_quests" ON user_quests;
CREATE POLICY "insert_own_quests" ON user_quests FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_quests" ON user_quests;
CREATE POLICY "update_own_quests" ON user_quests FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Events policies (public read)
DROP POLICY IF EXISTS "select_events" ON events;
CREATE POLICY "select_events" ON events FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_events" ON events;
CREATE POLICY "insert_events" ON events FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = organizer_id);

-- Event attendees policies
DROP POLICY IF EXISTS "select_event_attendees" ON event_attendees;
CREATE POLICY "select_event_attendees" ON event_attendees FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_attendance" ON event_attendees;
CREATE POLICY "insert_own_attendance" ON event_attendees FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_attendance" ON event_attendees;
CREATE POLICY "delete_own_attendance" ON event_attendees FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Posts policies
DROP POLICY IF EXISTS "select_posts" ON posts;
CREATE POLICY "select_posts" ON posts FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_posts" ON posts;
CREATE POLICY "insert_own_posts" ON posts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_posts" ON posts;
CREATE POLICY "update_own_posts" ON posts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_posts" ON posts;
CREATE POLICY "delete_own_posts" ON posts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Messages policies
DROP POLICY IF EXISTS "select_own_messages" ON messages;
CREATE POLICY "select_own_messages" ON messages FOR SELECT
  TO authenticated USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "insert_own_messages" ON messages;
CREATE POLICY "insert_own_messages" ON messages FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = sender_id);

-- Reports policies
DROP POLICY IF EXISTS "select_own_reports" ON reports;
CREATE POLICY "select_own_reports" ON reports FOR SELECT
  TO authenticated USING (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "insert_reports" ON reports;
CREATE POLICY "insert_reports" ON reports FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = reporter_id);
