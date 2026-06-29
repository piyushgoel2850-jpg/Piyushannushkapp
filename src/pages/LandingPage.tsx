import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Mic,
  ChefHat,
  Plane,
  Brain,
  FlaskConical,
  Landmark,
  Palette,
  Heart,
  Star,
  ArrowRight,
  Sparkles,
  Users,
  Compass,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";

const floatingIcons = [
  { Icon: BookOpen, color: "#E8B4B8", delay: 0, x: "10%", y: "15%" },
  { Icon: Mic, color: "#A8D5BA", delay: 0.5, x: "85%", y: "10%" },
  { Icon: ChefHat, color: "#FFADAD", delay: 1, x: "75%", y: "75%" },
  { Icon: Plane, color: "#A0C4FF", delay: 1.5, x: "15%", y: "80%" },
  { Icon: Brain, color: "#BDB2FF", delay: 2, x: "50%", y: "5%" },
  { Icon: FlaskConical, color: "#9BF6FF", delay: 0.3, x: "90%", y: "50%" },
  { Icon: Landmark, color: "#FDFFB6", delay: 0.8, x: "5%", y: "50%" },
  { Icon: Palette, color: "#FFB5BA", delay: 1.2, x: "60%", y: "85%" },
  { Icon: Star, color: "#FFD6A5", delay: 1.8, x: "30%", y: "70%" },
  { Icon: Heart, color: "#FF8C69", delay: 2.2, x: "70%", y: "30%" },
];

const interestCards = [
  {
    icon: BookOpen,
    title: "Books & Literature",
    color: "#E8B4B8",
    description: "Cozy reading corners and literary discussions",
  },
  {
    icon: Mic,
    title: "Singing & Music",
    color: "#A8D5BA",
    description: "Share your voice and discover melodies",
  },
  {
    icon: ChefHat,
    title: "Food & Culinary",
    color: "#FFADAD",
    description: "Cook, taste, and share recipes",
  },
  {
    icon: Plane,
    title: "Travel & Tourism",
    color: "#A0C4FF",
    description: "Explore the world together",
  },
  {
    icon: Brain,
    title: "Psychology",
    color: "#BDB2FF",
    description: "Understand minds and behaviors",
  },
  {
    icon: FlaskConical,
    title: "Science",
    color: "#9BF6FF",
    description: "Discover and experiment",
  },
];

const features = [
  {
    icon: Compass,
    title: "Discover Your Passion",
    description: "Find communities that match your interests and skill level",
  },
  {
    icon: Users,
    title: "Connect & Collaborate",
    description: "Meet like-minded people and work on projects together",
  },
  {
    icon: Trophy,
    title: "Complete Quests",
    description: "Earn XP and badges as you learn, create, and grow",
  },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8F0] overflow-x-hidden">
      {/* Floating Background Icons */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{ left: item.x, top: item.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={mounted ? { opacity: 0.15, scale: 1 } : {}}
            transition={{ delay: item.delay, duration: 1 }}
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 4 + index * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <item.Icon size={40} color={item.color} />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-pastel-pink" />
              <span className="text-sm font-medium text-gray-500 tracking-widest uppercase">
                Welcome to Your Passion Journey
              </span>
              <Sparkles className="w-6 h-6 text-pastel-lavender" />
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-gray-800">Where Passions</span>
              <br />
              <span className="gradient-text">Become Friendships</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Discover communities centered around what you love. Learn, create,
              collaborate, and turn strangers into lifelong friends through shared
              passions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary inline-flex items-center gap-2 text-lg">
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/explore" className="btn-secondary inline-flex items-center gap-2 text-lg">
                Explore Communities
              </Link>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            className="absolute -left-20 top-1/2 -translate-y-1/2 hidden lg:block"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <div className="polaroid w-48 transform -rotate-12">
              <div className="bg-pastel-pink/20 h-32 rounded flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-pastel-pink" />
              </div>
              <p className="handwritten text-sm text-gray-600 mt-2">Book Club</p>
            </div>
          </motion.div>

          <motion.div
            className="absolute -right-20 top-1/3 hidden lg:block"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 7, repeat: Infinity }}
          >
            <div className="polaroid w-48 transform rotate-12">
              <div className="bg-pastel-blue/20 h-32 rounded flex items-center justify-center">
                <Plane className="w-12 h-12 text-pastel-blue" />
              </div>
              <p className="handwritten text-sm text-gray-600 mt-2">Travel Diaries</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Your journey from discovering interests to building meaningful connections
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="scrapbook-card text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pastel-pink to-pastel-lavender flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interest Categories */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Explore Interests
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              From books to jamming sessions, find your tribe
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {interestCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="polaroid cursor-pointer"
                style={{ transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)` }}
              >
                <div
                  className="h-40 rounded flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${card.color}30` }}
                >
                  <card.icon size={48} color={card.color} />
                </div>
                <h3 className="font-bold text-gray-800">{card.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quests Preview */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Complete Quests
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Earn XP, unlock badges, and level up as you pursue your passions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Read One Book This Month",
                interest: "Books",
                xp: 100,
                color: "#E8B4B8",
                icon: BookOpen,
              },
              {
                title: "Sing a Dedication",
                interest: "Music",
                xp: 250,
                color: "#A8D5BA",
                icon: Mic,
              },
              {
                title: "Recreate Street Food",
                interest: "Food",
                xp: 200,
                color: "#FFADAD",
                icon: ChefHat,
              },
              {
                title: "Local Landmark Visit",
                interest: "Travel",
                xp: 150,
                color: "#A0C4FF",
                icon: Plane,
              },
              {
                title: "Cognitive Bias Discussion",
                interest: "Psychology",
                xp: 150,
                color: "#BDB2FF",
                icon: Brain,
              },
              {
                title: "Explain a Concept in 3 Minutes",
                interest: "Science",
                xp: 200,
                color: "#9BF6FF",
                icon: FlaskConical,
              },
            ].map((quest, index) => (
              <motion.div
                key={quest.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="sticky-note"
                style={{
                  transform: `rotate(${index % 2 === 0 ? -2 : 2}deg)`,
                  background: `linear-gradient(135deg, ${quest.color}40 0%, ${quest.color}20 100%)`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${quest.color}50` }}
                  >
                    <quest.icon size={20} color={quest.color} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">{quest.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ backgroundColor: `${quest.color}40` }}
                      >
                        {quest.interest}
                      </span>
                      <span className="text-xs text-gray-500">{quest.xp} XP</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="torn-paper bg-gradient-to-br from-pastel-pink/20 via-pastel-lavender/20 to-pastel-blue/20">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Ready to Find Your People?
            </h2>
            <p className="text-gray-600 mb-8">
              Join thousands of passion-seekers who have already discovered their
              communities. Your next adventure starts here.
            </p>
            <Link
              to="/signup"
              className="btn-primary inline-flex items-center gap-2 text-lg"
            >
              Join PassionSphere
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-pastel-pink" />
            <span className="font-bold text-gray-800">PassionSphere</span>
          </div>
          <p className="text-gray-500 text-sm">
            Transform strangers into communities through shared passions
          </p>
        </div>
      </footer>
    </div>
  );
}
