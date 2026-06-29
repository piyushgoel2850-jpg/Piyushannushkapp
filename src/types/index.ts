export interface UserProfile {
  id: string;
  name: string;
  username: string;
  bio: string;
  location: string;
  avatar_url: string;
  interests: UserInterest[];
  communities_joined: number;
  events_attended: number;
  challenges_completed: number;
  xp_points: number;
  achievements: string[];
  reputation_score: number;
  verification_status: string;
  created_at: string;
}

export interface UserInterest {
  interest_id: string;
  name: string;
  category: string;
  skill_level: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: string;
}

export interface Interest {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  color: string;
  sub_interests: string[];
}

export interface Community {
  id: string;
  name: string;
  description: string;
  interest_id: string;
  interest_name: string;
  member_count: number;
  icon: string;
  color: string;
  created_at: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  interest_id: string;
  interest_name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xp_reward: number;
  badge_reward: string;
  steps: string[];
  completed_count: number;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  capacity: number;
  attendees_count: number;
  organizer_id: string;
  organizer_name: string;
  interest_id: string;
  lat: number;
  lng: number;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  community_id: string;
  community_name: string;
  content: string;
  media_urls: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
  content: string;
  media_url: string | null;
  created_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  user_name: string;
  user_avatar: string;
  xp_points: number;
  rank: number;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}
