/*
# Create Community Chat Schema

1. New Tables
- `community_messages`
  - `id` (uuid, primary key)
  - `community_id` (text, not null) - references the community
  - `sender_id` (text, not null) - user identifier
  - `sender_name` (text, not null) - display name
  - `sender_avatar` (text) - avatar URL
  - `content` (text, not null) - message text
  - `media_url` (text) - optional image URL
  - `created_at` (timestamp)
- `community_chat_themes`
  - `community_id` (text, primary key)
  - `theme_name` (text, not null) - e.g., "books", "music", "food"
  - `primary_color` (text)
  - `secondary_color` (text)
  - `accent_color` (text)
  - `background_pattern` (text)
  - `created_at` (timestamp)

2. Security
- Enable RLS on both tables.
- Allow anon + authenticated CRUD since this is a community app without strict auth requirements.
*/

CREATE TABLE IF NOT EXISTS community_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id text NOT NULL,
  sender_id text NOT NULL,
  sender_name text NOT NULL,
  sender_avatar text,
  content text NOT NULL,
  media_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS community_chat_themes (
  community_id text PRIMARY KEY,
  theme_name text NOT NULL,
  primary_color text NOT NULL DEFAULT '#FFB5BA',
  secondary_color text NOT NULL DEFAULT '#FFF8F0',
  accent_color text NOT NULL DEFAULT '#C9B1FF',
  background_pattern text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_chat_themes ENABLE ROW LEVEL SECURITY;

-- Community messages policies
DROP POLICY IF EXISTS "anon_select_community_messages" ON community_messages;
CREATE POLICY "anon_select_community_messages" ON community_messages FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_community_messages" ON community_messages;
CREATE POLICY "anon_insert_community_messages" ON community_messages FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_community_messages" ON community_messages;
CREATE POLICY "anon_update_community_messages" ON community_messages FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_community_messages" ON community_messages;
CREATE POLICY "anon_delete_community_messages" ON community_messages FOR DELETE
TO anon, authenticated USING (true);

-- Community chat themes policies
DROP POLICY IF EXISTS "anon_select_community_chat_themes" ON community_chat_themes;
CREATE POLICY "anon_select_community_chat_themes" ON community_chat_themes FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_community_chat_themes" ON community_chat_themes;
CREATE POLICY "anon_insert_community_chat_themes" ON community_chat_themes FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_community_chat_themes" ON community_chat_themes;
CREATE POLICY "anon_update_community_chat_themes" ON community_chat_themes FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_community_chat_themes" ON community_chat_themes;
CREATE POLICY "anon_delete_community_chat_themes" ON community_chat_themes FOR DELETE
TO anon, authenticated USING (true);

-- Create index for faster community message queries
CREATE INDEX IF NOT EXISTS idx_community_messages_community_id ON community_messages(community_id);
CREATE INDEX IF NOT EXISTS idx_community_messages_created_at ON community_messages(created_at DESC);
