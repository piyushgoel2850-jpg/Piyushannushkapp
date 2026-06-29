import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  TrendingUp,
  Users,
  Calendar,
  Award,
  Star,
  Flame,
  ChevronRight,
  MapPin,
  Clock,
} from "lucide-react";
import {
  SAMPLE_COMMUNITIES,
  SAMPLE_QUESTS,
  SAMPLE_EVENTS,
  SAMPLE_LEADERBOARD,
} from "../data/constants";

const tabs = [
  { id: "all", label: "All", icon: Flame },
  { id: "communities", label: "Communities", icon: Users },
  { id: "quests", label: "Quests", icon: Award },
  { id: "events", label: "Events", icon: Calendar },
];

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCommunities = SAMPLE_COMMUNITIES.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredQuests = SAMPLE_QUESTS.filter((q) =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredEvents = SAMPLE_EVENTS.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#FFF8F0]/95 backdrop-blur-md border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search passions, communities, quests..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-pastel-pink focus:ring-2 focus:ring-pastel-pink/20 outline-none transition-all bg-white"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-pastel-pink text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {/* Trending Section */}
        {(activeTab === "all" || activeTab === "communities") && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-pastel-pink" />
                Trending Communities
              </h2>
              <Link
                to="/communities"
                className="text-sm text-pastel-pink flex items-center gap-1"
              >
                See all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredCommunities.slice(0, 4).map((community, index) => (
                <motion.div
                  key={community.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${community.color}30` }}
                    >
                      <Users className="w-6 h-6" style={{ color: community.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 truncate">
                        {community.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {community.interest_name}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {community.member_count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Quests Section */}
        {(activeTab === "all" || activeTab === "quests") && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Award className="w-5 h-5 text-pastel-lavender" />
                Popular Quests
              </h2>
              <Link
                to="/quests"
                className="text-sm text-pastel-lavender flex items-center gap-1"
              >
                See all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {filteredQuests.slice(0, 4).map((quest, index) => (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-sm">
                        {quest.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {quest.interest_name}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            quest.difficulty === "Easy"
                              ? "bg-green-100 text-green-700"
                              : quest.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {quest.difficulty}
                        </span>
                        <span className="text-xs text-gray-400">
                          {quest.xp_reward} XP
                        </span>
                      </div>
                    </div>
                    <Award className="w-8 h-8 text-pastel-lavender/50" />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Events Section */}
        {(activeTab === "all" || activeTab === "events") && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-pastel-blue" />
                Upcoming Events
              </h2>
              <Link
                to="/events"
                className="text-sm text-pastel-blue flex items-center gap-1"
              >
                See all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {filteredEvents.slice(0, 3).map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-pastel-blue/20 rounded-xl p-3 text-center min-w-[60px]">
                      <p className="text-xs text-gray-500">
                        {new Date(event.date).toLocaleString("default", {
                          month: "short",
                        })}
                      </p>
                      <p className="text-lg font-bold text-pastel-blue">
                        {new Date(event.date).getDate()}
                      </p>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-sm">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {event.venue}
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                        <Users className="w-3 h-3" />
                        {event.attendees_count}/{event.capacity} attending
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Leaderboard */}
        {activeTab === "all" && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Star className="w-5 h-5 text-accent-gold" />
                Top Contributors
              </h2>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {SAMPLE_LEADERBOARD.slice(0, 5).map((entry, index) => (
                <div
                  key={entry.user_id}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    index !== 4 ? "border-b border-gray-50" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0
                        ? "bg-yellow-100 text-yellow-700"
                        : index === 1
                        ? "bg-gray-100 text-gray-600"
                        : index === 2
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    {entry.rank}
                  </div>
                  <img
                    src={entry.user_avatar}
                    alt={entry.user_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-800">
                      {entry.user_name}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-pastel-pink">
                    {entry.xp_points.toLocaleString()} XP
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
