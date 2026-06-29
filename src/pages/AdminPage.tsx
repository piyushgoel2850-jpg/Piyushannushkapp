import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Shield,
  Flag,
  BarChart3,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Eye,
} from "lucide-react";

const adminTabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "users", label: "Users", icon: Users },
  { id: "reports", label: "Reports", icon: Flag },
  { id: "settings", label: "Settings", icon: Settings },
];

const stats = [
  { label: "Total Users", value: "12,456", change: "+12%", color: "bg-pastel-pink" },
  { label: "Active Communities", value: "234", change: "+8%", color: "bg-pastel-lavender" },
  { label: "Events This Month", value: "89", change: "+23%", color: "bg-pastel-blue" },
  { label: "Quests Completed", value: "3,421", change: "+15%", color: "bg-pastel-mint" },
];

const users = [
  { id: "1", name: "Sarah Reads", email: "sarah@example.com", status: "active", joined: "2024-01-15", xp: 4520 },
  { id: "2", name: "Mike Melody", email: "mike@example.com", status: "active", joined: "2024-01-20", xp: 3890 },
  { id: "3", name: "Chef Carla", email: "carla@example.com", status: "warning", joined: "2024-02-01", xp: 3450 },
  { id: "4", name: "Travel Tom", email: "tom@example.com", status: "active", joined: "2024-02-10", xp: 3120 },
  { id: "5", name: "Spam Bot", email: "spam@example.com", status: "banned", joined: "2024-03-01", xp: 0 },
];

const reports = [
  { id: "1", reporter: "Sarah Reads", reported: "Spam Bot", reason: "Spam content", status: "pending", date: "2024-03-15" },
  { id: "2", reporter: "Mike Melody", reported: "Unknown User", reason: "Inappropriate behavior", status: "resolved", date: "2024-03-14" },
  { id: "3", reporter: "Chef Carla", reported: "Troll Account", reason: "Harassment", status: "pending", date: "2024-03-13" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#FFF8F0]/95 backdrop-blur-md border-b border-gray-100 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-pastel-pink" />
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {adminTabs.map((tab) => (
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

      <div className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-4 border border-gray-100"
                >
                  <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <span className="text-xs text-green-600 font-medium">{stat.change}</span>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {[
                  { action: "New user registered", user: "Jamie Strings", time: "2 min ago", type: "user" },
                  { action: "Quest completed", user: "Sarah Reads", time: "5 min ago", type: "quest" },
                  { action: "Community created", user: "Science Sam", time: "12 min ago", type: "community" },
                  { action: "Event reported", user: "Unknown", time: "1 hour ago", type: "report" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activity.type === "user" ? "bg-pastel-pink/20" :
                      activity.type === "quest" ? "bg-pastel-lavender/20" :
                      activity.type === "community" ? "bg-pastel-blue/20" :
                      "bg-red-100"
                    }`}>
                      {activity.type === "user" ? <Users className="w-4 h-4 text-pastel-pink" /> :
                       activity.type === "quest" ? <CheckCircle className="w-4 h-4 text-pastel-lavender" /> :
                       activity.type === "community" ? <Shield className="w-4 h-4 text-pastel-blue" /> :
                       <AlertTriangle className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.user}</p>
                    </div>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-pastel-pink focus:ring-2 focus:ring-pastel-pink/20 outline-none transition-all bg-white"
              />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {users
                .filter((u) => u.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((user, index) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-3 px-4 py-4 ${index !== users.length - 1 ? "border-b border-gray-50" : ""}`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pastel-pink to-pastel-lavender flex items-center justify-center text-white font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.status === "active" ? "bg-green-100 text-green-700" :
                    user.status === "warning" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {user.status}
                  </span>
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Eye className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-4">
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-5 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-800">{report.reason}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Reported by {report.reporter} on {report.date}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    report.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {report.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <span>Reported user: <strong>{report.reported}</strong></span>
                </div>
                {report.status === "pending" && (
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 rounded-xl bg-green-100 text-green-700 text-sm font-medium hover:bg-green-200 transition-colors flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Resolve
                    </button>
                    <button className="flex-1 py-2 rounded-xl bg-red-100 text-red-700 text-sm font-medium hover:bg-red-200 transition-colors flex items-center justify-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Dismiss
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-4">Platform Settings</h2>
              <div className="space-y-4">
                {[
                  { label: "Enable new user registrations", enabled: true },
                  { label: "Require email verification", enabled: false },
                  { label: "Enable community creation", enabled: true },
                  { label: "Auto-moderation enabled", enabled: true },
                  { label: "XP notifications", enabled: true },
                ].map((setting, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-700">{setting.label}</span>
                    <button
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        setting.enabled ? "bg-pastel-pink" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5 transition-transform ${
                          setting.enabled ? "translate-x-6" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
