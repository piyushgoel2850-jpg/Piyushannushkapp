import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  MapPin,
  Camera,
  FileText,
  Sparkles,
} from "lucide-react";
import { INTERESTS, SKILL_LEVELS } from "../data/constants";

interface SelectedInterest {
  interestId: string;
  skillLevel: string;
}

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<SelectedInterest[]>([]);
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [avatar] = useState("");
  const navigate = useNavigate();

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) => {
      const exists = prev.find((i) => i.interestId === interestId);
      if (exists) {
        return prev.filter((i) => i.interestId !== interestId);
      }
      return [...prev, { interestId, skillLevel: "Beginner" }];
    });
  };

  const updateSkillLevel = (interestId: string, level: string) => {
    setSelectedInterests((prev) =>
      prev.map((i) =>
        i.interestId === interestId ? { ...i, skillLevel: level } : i
      )
    );
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate("/app");
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return selectedInterests.length > 0;
      case 1:
        return selectedInterests.every((i) => i.skillLevel);
      case 2:
        return location.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const steps = [
    { title: "Choose Interests", subtitle: "What are you passionate about?" },
    { title: "Skill Level", subtitle: "How experienced are you?" },
    { title: "Your Profile", subtitle: "Tell us about yourself" },
    { title: "Almost Done", subtitle: "Ready to explore?" },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
      {/* Header */}
      <div className="px-4 pt-8 pb-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-8 h-2 rounded-full transition-all duration-300 ${
                    i <= step ? "bg-pastel-pink" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <div className="w-9" />
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              {steps[step].title}
            </h1>
            <p className="text-gray-500">{steps[step].subtitle}</p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="interests"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {INTERESTS.map((interest) => {
                    const isSelected = selectedInterests.some(
                      (i) => i.interestId === interest.id
                    );
                    return (
                      <motion.button
                        key={interest.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleInterest(interest.id)}
                        className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                          isSelected
                            ? "border-pastel-pink bg-pastel-pink/10"
                            : "border-gray-100 bg-white hover:border-gray-200"
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                          style={{ backgroundColor: `${interest.color}30` }}
                        >
                          <span className="text-lg">
                            {/* Icon mapping would go here */}
                          </span>
                        </div>
                        <p className="font-medium text-sm text-gray-800">
                          {interest.name}
                        </p>
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <Check className="w-4 h-4 text-pastel-pink" />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {selectedInterests.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-4 border border-gray-100"
                  >
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Selected ({selectedInterests.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedInterests.map((si) => {
                        const interest = INTERESTS.find(
                          (i) => i.id === si.interestId
                        );
                        return (
                          <span
                            key={si.interestId}
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${interest?.color}30`,
                              color: interest?.color,
                            }}
                          >
                            {interest?.name}
                          </span>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {selectedInterests.map((si) => {
                  const interest = INTERESTS.find((i) => i.id === si.interestId);
                  if (!interest) return null;

                  return (
                    <div
                      key={si.interestId}
                      className="bg-white rounded-2xl p-4 border border-gray-100"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${interest.color}30` }}
                        >
                          <span className="text-lg"></span>
                        </div>
                        <span className="font-medium text-gray-800">
                          {interest.name}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {SKILL_LEVELS.map((level) => (
                          <button
                            key={level}
                            onClick={() =>
                              updateSkillLevel(si.interestId, level)
                            }
                            className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                              si.skillLevel === level
                                ? "bg-pastel-pink text-white"
                                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {/* Avatar Upload */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-pastel-pink to-pastel-lavender flex items-center justify-center">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Camera className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <button className="text-sm text-pastel-pink font-medium hover:underline">
                    Upload Photo
                  </button>
                </div>

                {/* Location */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pastel-pink focus:ring-2 focus:ring-pastel-pink/20 outline-none transition-all"
                    placeholder="City, Country"
                  />
                </div>

                {/* Bio */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4" />
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pastel-pink focus:ring-2 focus:ring-pastel-pink/20 outline-none transition-all resize-none"
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-pastel-pink via-pastel-lavender to-pastel-blue flex items-center justify-center"
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  You&apos;re All Set!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your passion journey begins now. Explore communities, complete
                  quests, and make new friends.
                </p>

                <div className="bg-white rounded-2xl p-4 border border-gray-100 text-left space-y-2">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">
                      {selectedInterests.length}
                    </span>{" "}
                    interests selected
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">{location}</span>{" "}
                    - your base camp
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-6 border-t border-gray-100 bg-white/50">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {step === 3 ? "Start Exploring" : "Continue"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
