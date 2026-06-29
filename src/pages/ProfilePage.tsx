import { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  MapPin,
  Calendar,
  Trophy,
  Settings,
  LogOut,
  BookOpen,
  Mic,
  ChefHat,
  Plane,
  Brain,
  FlaskConical,
  Landmark,
  Palette,
  Camera,
  Film,
  Dumbbell,
  Gamepad2,
  Cpu,
  PenTool,
  Guitar,
  Heart,
  Shield,
  Lock,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { LEVELS, BADGES } from "../data/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Mic,
  ChefHat,
  Plane,
  Brain,
  FlaskConical,
  Landmark,
  Palette,
  Camera,
  Film,
  Dumbbell,
  Gamepad2,
  Cpu,
  PenTool,
  Guitar,
};

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "achievements" | "activity">("overview");

  const userProfile = {
    name: user?.name || "Passion Seeker",
    username: "@passionseeker",
    bio: "Exploring the world one passion at a time. Books, music, and good food are my love language.",
    location: "San Francisco, CA",
    xp_points: 2340,
    communities_joined: 12,
    events_attended: 8,
    challenges_completed: 24,
    reputation_score: 4.8,
    verification_status: "verified",
    interests: [
      { name: "Books & Literature", skill_level: "Intermediate", icon: "BookOpen" },
      { name: "Singing & Music", skill_level: "Beginner", icon: "Mic" },
      { name: "Food & Culinary", skill_level: "Advanced", icon: "ChefHat" },
      { name: "Travel & Tourism", skill_level: "Intermediate", icon: "Plane" },
    ],
    achievements: ["Literary Critic", "Home Chef", "Explorer"],
    recentActivity: [
      { type: "quest", title: "Read One Book This Month", date: "2 days ago", xp: 100 },
      { type: "event", title: "Monthly Book Club", date: "1 week ago", xp: 50 },
      { type: "quest", title: "Recreate Street Food", date: "2 weeks ago", xp: 200 },
    ],
  };

  const currentLevel = LEVELS.reduce((acc, level) => {
    if (userProfile.xp_points >= level.minXp) return level;
    return acc;
  }, LEVELS[0]);

  const nextLevel = LEVELS.find((l) => l.minXp > userProfile.xp_points);
  const progressToNext = nextLevel
    ? ((userProfile.xp_points - currentLevel.minXp) /
        (nextLevel.minXp - currentLevel.minXp)) *
      100
    : 100;

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">
      <div className="relative bg-gradient-to-br from-pastel-pink/30 via-pastel-lavender/30 to-pastel-blue/30 px-4 pt-8 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-800">Profile</h1>
            <div className="flex gap-2">
              <button className="p-2 rounded-xl bg-white/50 hover:bg-white/80 transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => signOut()}
                className="p-2 rounded-xl bg-white/50 hover:bg-white/80 transition-colors"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pastel-pink to-pastel-lavender flex items-center justify-center text-white text-2xl font-bold">
                {userProfile.name.charAt(0)}
              </div>
              {userProfile.verification_status === "verified" && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">{userProfile.name}</h2>
              <p className="text-sm text-gray-500">{userProfile.username}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                {userProfile.location}
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-600">{userProfile.bio}</p>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/60 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-gray-800">
                {userProfile.communities_joined}
              </p>
              <p className="text-xs text-gray-500">Communities</p>
            </div>
            <div className="bg-white/60 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-gray-800">
                {userProfile.events_attended}
              </p>
              <p className="text-xs text-gray-500">Events</p>
            </div>
            <div className="bg-white/60 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-gray-800">
                {userProfile.challenges_completed}
              </p>
              <p className="text-xs text-gray-500">Quests</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent-gold" />
              <span className="font-bold text-gray-800">{currentLevel.name}</span>
            </div>
            <span className="text-sm text-gray-500">
              {userProfile.xp_points.toLocaleString()} XP
            </span>
          </div>
          {nextLevel && (
            <>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                <motion.div
                  className="h-full bg-gradient-to-r from-pastel-pink to-pastel-lavender rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNext}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <p className="text-xs text-gray-500">
                {nextLevel.minXp - userProfile.xp_points} XP to {nextLevel.name}
              </p>
            </>
          )}
        </motion.div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-6">
        <div className="flex gap-2 mb-6">
          {(["overview", "achievements", "activity"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-pastel-pink text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            <section>
              <h3 className="font-bold text-gray-800 mb-3">My Interests</h3>
              <div className="space-y-3">
                {userProfile.interests.map((interest) => {
                  const IconComponent = iconMap[interest.icon] || Heart;
                  return (
                    <div
                      key={interest.name}
                      className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-xl bg-pastel-pink/20 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-pastel-pink" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{interest.name}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            interest.skill_level === "Beginner"
                              ? "bg-green-100 text-green-700"
                              : interest.skill_level === "Intermediate"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {interest.skill_level}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="space-y-6">
            <section>
              <h3 className="font-bold text-gray-800 mb-3">Badges</h3>
              <div className="grid grid-cols-2 gap-3">
                {BADGES.map((badge) => {
                  const earned = userProfile.achievements.includes(badge.name);
                  const IconComponent = iconMap[badge.icon] || Award;
                  return (
                    <div
                      key={badge.id}
                      className={`rounded-2xl p-4 border text-center transition-all ${
                        earned
                          ? "bg-white border-gray-100"
                          : "bg-gray-50 border-gray-100 opacity-50"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-2 ${
                          earned ? "bg-pastel-lavender/20" : "bg-gray-200"
                        }`}
                      >
                        {earned ? (
                          <IconComponent className="w-6 h-6 text-pastel-lavender" />
                        ) : (
                          <Lock className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-800">{badge.name}</p>
                      {earned && (
                        <span className="text-xs text-green-600">Earned</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-4">
            {userProfile.recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-3"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    activity.type === "quest"
                      ? "bg-pastel-lavender/20"
                      : "bg-pastel-blue/20"
                  }`}
                >
                  {activity.type === "quest" ? (
                    <Award className="w-5 h-5 text-pastel-lavender" />
                  ) : (
                    <Calendar className="w-5 h-5 text-pastel-blue" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-800">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
                <span className="text-sm font-bold text-pastel-pink">
                  +{activity.xp} XP
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
