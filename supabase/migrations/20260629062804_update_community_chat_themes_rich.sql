/*
# Update Community Chat Themes with Rich Aesthetic Palettes

Updates each community chat theme with beautiful, immersive color palettes
that match the community topic - warm and cozy for books, vibrant for music,
appetizing for food, adventurous for travel, etc.
*/

UPDATE community_chat_themes SET
  primary_color = '#D4A574',
  secondary_color = '#FDF6E3',
  accent_color = '#8B6914',
  background_pattern = 'books'
WHERE community_id = 'c1';

UPDATE community_chat_themes SET
  primary_color = '#9B7EDE',
  secondary_color = '#F3EFFF',
  accent_color = '#6B4EE6',
  background_pattern = 'feather'
WHERE community_id = 'c2';

UPDATE community_chat_themes SET
  primary_color = '#4ECDC4',
  secondary_color = '#E8F8F5',
  accent_color = '#2E8B57',
  background_pattern = 'music'
WHERE community_id = 'c3';

UPDATE community_chat_themes SET
  primary_color = '#F4A261',
  secondary_color = '#FFF5EB',
  accent_color = '#E76F51',
  background_pattern = 'guitar'
WHERE community_id = 'c4';

UPDATE community_chat_themes SET
  primary_color = '#E76F51',
  secondary_color = '#FFF0ED',
  accent_color = '#D62828',
  background_pattern = 'food'
WHERE community_id = 'c5';

UPDATE community_chat_themes SET
  primary_color = '#457B9D',
  secondary_color = '#EDF6F9',
  accent_color = '#1D3557',
  background_pattern = 'travel'
WHERE community_id = 'c6';

UPDATE community_chat_themes SET
  primary_color = '#BC8F4F',
  secondary_color = '#FFF8E7',
  accent_color = '#8B6914',
  background_pattern = 'landmark'
WHERE community_id = 'c7';

UPDATE community_chat_themes SET
  primary_color = '#2A9D8F',
  secondary_color = '#E8F6F3',
  accent_color = '#264653',
  background_pattern = 'flask'
WHERE community_id = 'c8';

UPDATE community_chat_themes SET
  primary_color = '#7B68EE',
  secondary_color = '#F5F0FF',
  accent_color = '#5B3FC0',
  background_pattern = 'brain'
WHERE community_id = 'c9';
