/*
# Add Immersive Communities and Chat Themes

Adds 11 new themed communities to the database with rich aesthetic configurations.
Each community has a unique "living aesthetic room" theme that creates an emotional
atmosphere matching the interest topic.
*/

-- Insert new communities with gen_random_uuid()
INSERT INTO communities (name, description, interest_id, member_count, icon, color, created_at)
VALUES
  ('Bookstagram Dream', 'A cozy reading nook for book lovers. Share reviews, discover new reads, and connect with fellow bibliophiles.', 'books', 3421, 'BookOpen', '#D4A5A5', now()),
  ('Midnight Vinyl', 'A dreamy music room for producers, singers, and music lovers. Share tracks, get feedback, and jam together.', 'music', 2876, 'Music', '#7B2D8E', now()),
  ('Passport to Everywhere', 'A scrapbook of adventures from around the world. Share travel stories, tips, and hidden gems.', 'travel', 2156, 'Plane', '#4A90A4', now()),
  ('Cute Cafe Society', 'A cheerful cafe where foodies gather. Share recipes, restaurant finds, and cooking adventures.', 'food', 4521, 'ChefHat', '#E8A87C', now()),
  ('Creative Studio', 'A digital artist desk brought to life. Share artwork, get inspired, and create together.', 'arts', 1876, 'Palette', '#B8A9C9', now()),
  ('Pixel Arcade', 'A cozy gaming world for players of all kinds. Share gameplay, tips, and find teammates.', 'gaming', 5632, 'Gamepad2', '#4A5568', now()),
  ('Cinema Lounge', 'A luxurious movie night atmosphere. Discuss films, series, and the magic of storytelling.', 'film', 2345, 'Film', '#8B2635', now()),
  ('Forest Whisper', 'A peaceful digital forest for nature lovers. Share hikes, plant care, and outdoor moments.', 'nature', 1234, 'TreePine', '#6B8E6B', now()),
  ('Memory Garden', 'A garden of human connections. Celebrate friendships, relationships, and meaningful moments.', 'social', 3210, 'Heart', '#E8B4B8', now()),
  ('Focus Haven', 'A productivity space that feels warm. Study together, share tips, and stay motivated.', 'study', 1987, 'BookMarked', '#8FA5B8', now()),
  ('Aesthetic Social Universe', 'A dreamy universe for mixed interests. Share anything beautiful, from art to life moments.', 'general', 6789, 'Sparkles', '#F4A6B5', now());

-- Insert chat themes for new communities (matching by name since UUIDs are generated)
INSERT INTO community_chat_themes (community_id, theme_name, primary_color, secondary_color, accent_color, background_pattern, created_at)
SELECT c.id, 'Bookstagram Dream', '#D4A5A5', '#FDF6E3', '#8B7355', 'bookstagram', now()
FROM communities c WHERE c.name = 'Bookstagram Dream'
UNION ALL
SELECT c.id, 'Midnight Vinyl', '#7B2D8E', '#1A0A2E', '#FF6B9D', 'midnight_vinyl', now()
FROM communities c WHERE c.name = 'Midnight Vinyl'
UNION ALL
SELECT c.id, 'Passport to Everywhere', '#4A90A4', '#FFF8F0', '#E8734A', 'passport', now()
FROM communities c WHERE c.name = 'Passport to Everywhere'
UNION ALL
SELECT c.id, 'Cute Cafe Society', '#E8A87C', '#FFF5F0', '#88D8B0', 'cafe_society', now()
FROM communities c WHERE c.name = 'Cute Cafe Society'
UNION ALL
SELECT c.id, 'Creative Studio', '#B8A9C9', '#F8F6FF', '#FFE66D', 'creative_studio', now()
FROM communities c WHERE c.name = 'Creative Studio'
UNION ALL
SELECT c.id, 'Pixel Arcade', '#4A5568', '#1A202C', '#00D4AA', 'pixel_arcade', now()
FROM communities c WHERE c.name = 'Pixel Arcade'
UNION ALL
SELECT c.id, 'Cinema Lounge', '#8B2635', '#1A1A2E', '#D4AF37', 'cinema_lounge', now()
FROM communities c WHERE c.name = 'Cinema Lounge'
UNION ALL
SELECT c.id, 'Forest Whisper', '#6B8E6B', '#F5F5DC', '#87CEEB', 'forest_whisper', now()
FROM communities c WHERE c.name = 'Forest Whisper'
UNION ALL
SELECT c.id, 'Memory Garden', '#E8B4B8', '#FFF0F5', '#D4AF37', 'memory_garden', now()
FROM communities c WHERE c.name = 'Memory Garden'
UNION ALL
SELECT c.id, 'Focus Haven', '#8FA5B8', '#F5F5F0', '#7BAE7F', 'focus_haven', now()
FROM communities c WHERE c.name = 'Focus Haven'
UNION ALL
SELECT c.id, 'Aesthetic Social Universe', '#F4A6B5', '#FFF5F7', '#87CEEB', 'aesthetic_universe', now()
FROM communities c WHERE c.name = 'Aesthetic Social Universe'
ON CONFLICT (community_id) DO NOTHING;
