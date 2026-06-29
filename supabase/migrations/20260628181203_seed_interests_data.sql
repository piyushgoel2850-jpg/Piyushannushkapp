/*
# Seed Interests Data

1. Modified Tables
- Populates `interests` table with all 15 core interest categories
- Includes sub-interests for each category

2. Important Notes
- Uses ON CONFLICT to make idempotent for re-runs
- All interests are public data, no RLS restrictions needed for read
*/

INSERT INTO interests (id, name, category, description, icon, color, sub_interests) VALUES
('books', 'Books & Literature', 'books', 'Discover, read, and discuss books with fellow bibliophiles', 'BookOpen', '#E8B4B8', ARRAY['Fiction', 'Non-fiction', 'Philosophy', 'History', 'Poetry']),
('writing', 'Writing & Poetry', 'writing', 'Express yourself through words and verses', 'PenTool', '#C9B1FF', ARRAY['Creative Writing', 'Poetry', 'Screenwriting', 'Blogging', 'Journaling']),
('arts', 'Hobbies & Creative Arts', 'arts', 'Paint, craft, and create with passionate artists', 'Palette', '#FFB5BA', ARRAY['Painting', 'Drawing', 'Crafting', 'DIY', 'Sculpting']),
('music', 'Singing & Music', 'music', 'Share your voice and musical journey', 'Mic', '#A8D5BA', ARRAY['Singing', 'Vocal Training', 'Classical', 'Pop', 'Indie']),
('jamming', 'Jamming Sessions', 'jamming', 'Collaborate and jam with musicians worldwide', 'Guitar', '#FFD6A5', ARRAY['Guitar', 'Piano', 'Drums', 'Bass', 'Improvisation']),
('food', 'Food & Culinary', 'food', 'Cook, share recipes, and explore flavors', 'ChefHat', '#FFADAD', ARRAY['Street Food', 'Home Cooking', 'Baking', 'Regional Cuisine', 'Healthy Eating']),
('travel', 'Tourism & Travel', 'travel', 'Explore the world and share adventures', 'Plane', '#A0C4FF', ARRAY['Backpacking', 'Luxury Travel', 'Local Exploration', 'Travel Vlogs', 'Hidden Gems']),
('heritage', 'Heritage & Culture', 'heritage', 'Preserve and celebrate cultural traditions', 'Landmark', '#FDFFB6', ARRAY['Heritage Walks', 'Cultural Stories', 'Traditional Arts', 'History', 'Festivals']),
('science', 'Science & Intellect', 'science', 'Discuss discoveries and explore knowledge', 'FlaskConical', '#9BF6FF', ARRAY['Physics', 'Biology', 'Chemistry', 'Astronomy', 'Research']),
('psychology', 'Psychology & Behavior', 'psychology', 'Understand the mind and human behavior', 'Brain', '#BDB2FF', ARRAY['Behavioral Psychology', 'Cognitive Science', 'Communication', 'Emotional Intelligence', 'Mindfulness']),
('photography', 'Photography', 'photography', 'Capture moments and master the lens', 'Camera', '#FFC6FF', ARRAY['Portrait', 'Landscape', 'Street', 'Wildlife', 'Film']),
('film', 'Film & Cinema', 'film', 'Discuss, create, and appreciate cinema', 'Film', '#CAFFBF', ARRAY['Directing', 'Screenwriting', 'Cinematography', 'Film Analysis', 'Short Films']),
('fitness', 'Fitness & Sports', 'fitness', 'Train, compete, and stay active together', 'Dumbbell', '#FF9AA2', ARRAY['Running', 'Yoga', 'Gym', 'Team Sports', 'Outdoor Activities']),
('gaming', 'Gaming', 'gaming', 'Play, compete, and connect through games', 'Gamepad2', '#B5EAD7', ARRAY['RPG', 'FPS', 'Strategy', 'Indie Games', 'Esports']),
('technology', 'Technology', 'technology', 'Code, build, and innovate together', 'Cpu', '#E2F0CB', ARRAY['Programming', 'AI/ML', 'Web Dev', 'Mobile Dev', 'Cybersecurity'])
ON CONFLICT (id) DO NOTHING;
