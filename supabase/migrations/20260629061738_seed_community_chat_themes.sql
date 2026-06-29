/*
# Seed Community Chat Themes

Inserts theme configurations for each community based on their interest category.
Each community gets a unique visual theme for its chat room.
*/

INSERT INTO community_chat_themes (community_id, theme_name, primary_color, secondary_color, accent_color, background_pattern)
VALUES
  ('c1', 'books', '#E8B4B8', '#FFF0F0', '#8B4513', 'books'),
  ('c2', 'books', '#C9B1FF', '#F5F0FF', '#6B4EE6', 'feather'),
  ('c3', 'music', '#A8D5BA', '#F0FFF4', '#2E8B57', 'music'),
  ('c4', 'jamming', '#FFD6A5', '#FFF8F0', '#D2691E', 'guitar'),
  ('c5', 'food', '#FFADAD', '#FFF5F5', '#DC143C', 'food'),
  ('c6', 'travel', '#A0C4FF', '#F0F5FF', '#4169E1', 'travel'),
  ('c7', 'heritage', '#FDFFB6', '#FFFFF0', '#B8860B', 'landmark'),
  ('c8', 'science', '#9BF6FF', '#F0FFFF', '#008B8B', 'flask'),
  ('c9', 'psychology', '#BDB2FF', '#F5F0FF', '#9370DB', 'brain')
ON CONFLICT (community_id) DO UPDATE SET
  theme_name = EXCLUDED.theme_name,
  primary_color = EXCLUDED.primary_color,
  secondary_color = EXCLUDED.secondary_color,
  accent_color = EXCLUDED.accent_color,
  background_pattern = EXCLUDED.background_pattern;
