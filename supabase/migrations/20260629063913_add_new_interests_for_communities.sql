/*
# Add New Interests for Immersive Communities

Adds missing interest categories that the new communities reference:
- nature (Forest Whisper)
- social (Memory Garden)
- study (Focus Haven)
- general (Aesthetic Social Universe)

These map to the 11 new themed communities being created.
*/

INSERT INTO interests (id, name, category, description, icon, color, sub_interests)
VALUES
  ('nature', 'Nature & Outdoors', 'nature', 'Explore the natural world, from forests to gardens', 'TreePine', '#6B8E6B', ARRAY['Hiking', 'Gardening', 'Wildlife', 'Camping', 'Botany']),
  ('social', 'Relationships & Friendship', 'social', 'Celebrate human connections and meaningful relationships', 'Heart', '#E8B4B8', ARRAY['Friendship', 'Dating', 'Social Skills', 'Community', 'Support']),
  ('study', 'Study & Productivity', 'study', 'Study together, stay focused, and achieve goals', 'BookMarked', '#8FA5B8', ARRAY['Study Groups', 'Focus Sessions', 'Note Taking', 'Time Management', 'Motivation']),
  ('general', 'General Interest', 'general', 'A space for everything beautiful and interesting', 'Sparkles', '#F4A6B5', ARRAY['Lifestyle', 'Aesthetics', 'Daily Moments', 'Inspiration', 'Trends'])
ON CONFLICT (id) DO NOTHING;
