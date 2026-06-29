import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  Flame,
  Trophy,
} from "lucide-react";
import { SAMPLE_QUESTS } from "../data/constants";

export default function QuestsPage() {
  const [selectedQuest, setSelectedQuest] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("all");

  const quest = selectedQuest
    ? SAMPLE_QUESTS.find((q) => q.id === selectedQuest)
    : null;

  const toggleStep = (stepIndex: number) => {
    const key = `${selectedQuest}-${stepIndex}`;
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const filteredQuests =
    filter === "all"
      ? SAMPLE_QUESTS
      : SAMPLE_QUESTS.filter((q) => {
          if (filter === "easy") return q.difficulty === "Easy";
          if (filter === "medium") return q.difficulty === "Medium";
          if (filter === "hard") return q.difficulty === "Hard";
          return true;
        });

  if (selectedQuest && quest) {
    const progress = quest.steps.filter((_, i) =>
      completedSteps.has(`${selectedQuest}-${i}`)
    ).length;
    const progressPercent = (progress / quest.steps.length) * 100;

    return (
      <div className="min-h-screen bg-[#FFF8F0] pb-24">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-[#FFF8F0]/95 backdrop-blur-md border-b border-gray-100 px-4 py-4">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <button
              onClick={() => setSelectedQuest(null)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-gray-800">{quest.title}</h1>
              <p className="text-xs text-gray-500">{quest.interest_name}</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Quest Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  quest.difficulty === "Easy"
                    ? "bg-green-100"
                    : quest.difficulty === "Medium"
                    ? "bg-yellow-100"
                    : "bg-red-100"
                }`}
              >
                <Flame
                  className={`w-6 h-6 ${
                    quest.difficulty === "Easy"
                      ? "text-green-600"
                      : quest.difficulty === "Medium"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                />
              </div>
              <div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    quest.difficulty === "Easy"
                      ? "bg-green-100 text-green-700"
                      : quest.difficulty === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {quest.difficulty}
                </span>
                <p className="text-sm font-bold text-gray-800 mt-1">
                  {quest.xp_reward} XP
                </p>
              </div>
              {quest.badge_reward && (
                <div className="ml-auto flex items-center gap-2 bg-pastel-lavender/20 px-3 py-2 rounded-xl">
                  <Trophy className="w-5 h-5 text-pastel-lavender" />
                  <span className="text-sm font-medium text-gray-700">
                    {quest.badge_reward}
                  </span>
                </div>
              )}
            </div>

            <p className="text-gray-600 mb-4">{quest.description}</p>

            {/* Progress */}
            <div className="mb-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-bold text-gray-800">
                  {progress}/{quest.steps.length}
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pastel-pink to-pastel-lavender rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Steps */}
          <div className="space-y-3">
            <h2 className="font-bold text-gray-800 mb-4">Steps</h2>
            {quest.steps.map((step, index) => {
              const isCompleted = completedSteps.has(`${selectedQuest}-${index}`);
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => toggleStep(index)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                    isCompleted
                      ? "bg-green-50 border-green-200"
                      : "bg-white border-gray-100 hover:border-pastel-pink"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`flex-1 ${
                      isCompleted
                        ? "text-gray-500 line-through"
                        : "text-gray-800"
                    }`}
                  >
                    {step}
                  </span>
                </motion.button>
              );
            })}
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
          <h1 className="text-xl font-bold text-gray-800 mb-4">Quests</h1>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {[
              { id: "all", label: "All" },
              { id: "easy", label: "Easy" },
              { id: "medium", label: "Medium" },
              { id: "hard", label: "Hard" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  filter === f.id
                    ? "bg-pastel-pink text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {filteredQuests.map((quest, index) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedQuest(quest.id)}
            className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-gray-800">{quest.title}</h3>
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
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  {quest.interest_name}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {quest.description}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs text-gray-400">
                    {quest.xp_reward} XP
                  </span>
                  <span className="text-xs text-gray-400">
                    {quest.completed_count} completed
                  </span>
                  {quest.badge_reward && (
                    <span className="flex items-center gap-1 text-xs text-pastel-lavender">
                      <Trophy className="w-3 h-3" />
                      {quest.badge_reward}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
