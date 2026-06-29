import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Plus,
  MessageCircle,
  Heart,
  Share2,
  MoreHorizontal,
  ChevronLeft,
} from "lucide-react";
import { SAMPLE_COMMUNITIES, SAMPLE_POSTS } from "../data/constants";
import { useCommunity } from "../context/CommunityContext";

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedCommunity, selectCommunity, openChat, clearCommunity } = useCommunity();

  const community = selectedCommunity
    ? SAMPLE_COMMUNITIES.find((c) => c.id === selectedCommunity.id)
    : null;

  const communityPosts = selectedCommunity
    ? SAMPLE_POSTS.filter((p) => p.community_id === selectedCommunity.id)
    : [];

  const filteredCommunities = SAMPLE_COMMUNITIES.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedCommunity && community) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] pb-24">
        {/* Community Header */}
        <div className="sticky top-0 z-30 bg-[#FFF8F0]/95 backdrop-blur-md border-b border-gray-100 px-4 py-4">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <button
              onClick={clearCommunity}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${community.color}30` }}
            >
              <Users className="w-5 h-5" style={{ color: community.color }} />
            </div>
            <div className="flex-1">
              <h1 className="font-bold text-gray-800">{community.name}</h1>
              <p className="text-xs text-gray-500">
                {community.member_count.toLocaleString()} members
              </p>
            </div>
            <button className="btn-primary text-sm py-2 px-4">Join</button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Community Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
            <p className="text-gray-600">{community.description}</p>
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => openChat(community)}
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:scale-105"
                style={{ color: community.color }}
              >
                <MessageCircle className="w-4 h-4" />
                Open Chat
              </button>
              <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-pastel-pink transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {communityPosts.length > 0 ? (
              communityPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-4 border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={post.user_avatar}
                      alt={post.user_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-sm text-gray-800">
                        {post.user_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="ml-auto p-1 rounded-lg hover:bg-gray-100">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <button className="flex items-center gap-1 hover:text-pastel-pink transition-colors">
                      <Heart className="w-4 h-4" />
                      {post.likes_count}
                    </button>
                    <button className="flex items-center gap-1 hover:text-pastel-blue transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments_count}
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No posts yet. Be the first!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#FFF8F0]/95 backdrop-blur-md border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800">Communities</h1>
            <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search communities..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-pastel-pink focus:ring-2 focus:ring-pastel-pink/20 outline-none transition-all bg-white"
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredCommunities.map((community, index) => (
            <motion.div
              key={community.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => selectCommunity(community)}
              className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${community.color}30` }}
                >
                  <Users className="w-7 h-7" style={{ color: community.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800">{community.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {community.interest_name}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {community.description}
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
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
      </div>
    </div>
  );
}
