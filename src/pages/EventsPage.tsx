import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Users,
  ChevronRight,
  ChevronLeft,
  Plus,
  Search,
  Share2,
} from "lucide-react";
import { SAMPLE_EVENTS } from "../data/constants";

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const event = selectedEvent
    ? SAMPLE_EVENTS.find((e) => e.id === selectedEvent)
    : null;

  const filteredEvents = SAMPLE_EVENTS.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || e.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(SAMPLE_EVENTS.map((e) => e.category))];

  if (selectedEvent && event) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] pb-24">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-[#FFF8F0]/95 backdrop-blur-md border-b border-gray-100 px-4 py-4">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <button
              onClick={() => setSelectedEvent(null)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-gray-800 flex-1 truncate">{event.title}</h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Event Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-pastel-blue/20 rounded-xl p-3 text-center min-w-[70px]">
                  <p className="text-xs text-gray-500">
                    {new Date(event.date).toLocaleString("default", { month: "short" })}
                  </p>
                  <p className="text-2xl font-bold text-pastel-blue">
                    {new Date(event.date).getDate()}
                  </p>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800">{event.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {event.time}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {event.venue}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-gray-400" />
                  {event.attendees_count}/{event.capacity} attending
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 btn-primary py-3">RSVP</button>
                <button className="px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Organizer */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <p className="text-sm font-medium text-gray-500 mb-2">Organized by</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pastel-pink to-pastel-lavender flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {event.organizer_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{event.organizer_name}</p>
                  <p className="text-xs text-gray-500">Community Leader</p>
                </div>
              </div>
            </div>
          </motion.div>
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
            <h1 className="text-xl font-bold text-gray-800">Events</h1>
            <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-pastel-pink focus:ring-2 focus:ring-pastel-pink/20 outline-none transition-all bg-white"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  filterCategory === cat
                    ? "bg-pastel-blue text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                }`}
              >
                {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedEvent(event.id)}
            className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="bg-pastel-blue/20 rounded-xl p-3 text-center min-w-[60px]">
                <p className="text-xs text-gray-500">
                  {new Date(event.date).toLocaleString("default", { month: "short" })}
                </p>
                <p className="text-xl font-bold text-pastel-blue">
                  {new Date(event.date).getDate()}
                </p>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{event.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {event.time}
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  {event.venue}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-400">
                    <Users className="w-3 h-3 inline mr-1" />
                    {event.attendees_count}/{event.capacity}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
