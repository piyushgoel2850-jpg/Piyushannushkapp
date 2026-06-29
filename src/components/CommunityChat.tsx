import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Image,
  X,
  ChevronLeft,
  Loader2,
  Sparkles,
  Hash,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Community } from "../types";

interface ChatMessage {
  id: string;
  community_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
  content: string;
  media_url: string | null;
  created_at: string;
}

interface ChatTheme {
  community_id: string;
  theme_name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_pattern: string;
}

interface CommunityChatProps {
  community: Community;
  onClose: () => void;
}

// Rich themed configurations for each community type
const THEME_CONFIG: Record<string, {
  icon: string;
  emoji: string;
  headerGradient: string;
  bubbleGradient: string;
  ownBubbleGradient: string;
  pattern: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  floatingElements: string[];
  fontFamily: string;
}> = {
  books: {
    icon: "📖",
    emoji: "📚",
    headerGradient: "linear-gradient(135deg, #D4A574 0%, #C49A6C 50%, #B8860B 100%)",
    bubbleGradient: "linear-gradient(135deg, #FDF6E3 0%, #FAEDCD 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #D4A574 0%, #C49A6C 100%)",
    pattern: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20 Q40 5 60 20 T100 20' stroke='%23D4A574' stroke-width='0.5' fill='none' opacity='0.08'/%3E%3Cpath d='M0 50 Q25 35 50 50 T100 50' stroke='%23D4A574' stroke-width='0.5' fill='none' opacity='0.08'/%3E%3Cpath d='M20 80 Q40 65 60 80 T100 80' stroke='%23D4A574' stroke-width='0.5' fill='none' opacity='0.08'/%3E%3C/svg%3E\")",
    welcomeTitle: "Welcome to the Library",
    welcomeSubtitle: "Every great conversation starts with a single word. Share your thoughts on books, stories, and the magic of reading.",
    floatingElements: ["📖", "✨", "🕯️", "☕"],
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  feather: {
    icon: "🪶",
    emoji: "✍️",
    headerGradient: "linear-gradient(135deg, #9B7EDE 0%, #7B68EE 50%, #6B4EE6 100%)",
    bubbleGradient: "linear-gradient(135deg, #F3EFFF 0%, #E8E0FF 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #9B7EDE 0%, #7B68EE 100%)",
    pattern: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 Q30 0 50 10' stroke='%239B7EDE' stroke-width='0.5' fill='none' opacity='0.06'/%3E%3Cpath d='M0 30 Q20 20 40 30 T60 30' stroke='%239B7EDE' stroke-width='0.5' fill='none' opacity='0.06'/%3E%3Cpath d='M10 50 Q30 40 50 50' stroke='%239B7EDE' stroke-width='0.5' fill='none' opacity='0.06'/%3E%3C/svg%3E\")",
    welcomeTitle: "The Poetry Corner",
    welcomeSubtitle: "Where words dance and verses flow. Share your poetry, find inspiration, and connect with fellow wordsmiths.",
    floatingElements: ["🪶", "🌙", "✨", "📜"],
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  music: {
    icon: "🎵",
    emoji: "🎤",
    headerGradient: "linear-gradient(135deg, #4ECDC4 0%, #45B7AA 50%, #2E8B57 100%)",
    bubbleGradient: "linear-gradient(135deg, #E8F8F5 0%, #D4F1EA 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #4ECDC4 0%, #45B7AA 100%)",
    pattern: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1.5' fill='%234ECDC4' opacity='0.1'/%3E%3Ccircle cx='5' cy='5' r='1' fill='%234ECDC4' opacity='0.08'/%3E%3Ccircle cx='35' cy='35' r='1' fill='%234ECDC4' opacity='0.08'/%3E%3C/svg%3E\")",
    welcomeTitle: "The Stage is Yours",
    welcomeSubtitle: "Sing, share, and celebrate music together. Every voice matters in this community of melody.",
    floatingElements: ["🎵", "🎤", "🎶", "⭐"],
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  guitar: {
    icon: "🎸",
    emoji: "🤘",
    headerGradient: "linear-gradient(135deg, #F4A261 0%, #E76F51 50%, #D62828 100%)",
    bubbleGradient: "linear-gradient(135deg, #FFF5EB 0%, #FFE8D6 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
    pattern: "url(\"data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 25 L50 25' stroke='%23F4A261' stroke-width='0.5' opacity='0.08'/%3E%3Cpath d='M25 0 L25 50' stroke='%23F4A261' stroke-width='0.5' opacity='0.08'/%3E%3C/svg%3E\")",
    welcomeTitle: "Jam Central",
    welcomeSubtitle: "Grab your instrument and join the jam! Share riffs, get feedback, and rock out with fellow musicians.",
    floatingElements: ["🎸", "🔥", "🎵", "🥁"],
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  food: {
    icon: "🍳",
    emoji: "👨‍🍳",
    headerGradient: "linear-gradient(135deg, #E76F51 0%, #D62828 50%, #C0392B 100%)",
    bubbleGradient: "linear-gradient(135deg, #FFF0ED 0%, #FFE0D8 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #E76F51 0%, #D62828 100%)",
    pattern: "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='15' cy='15' r='2' fill='%23E76F51' opacity='0.08'/%3E%3C/svg%3E\")",
    welcomeTitle: "The Kitchen Table",
    welcomeSubtitle: "Good food, great company. Share recipes, cooking tips, and the joy of creating delicious moments.",
    floatingElements: ["🍳", "🌶️", "🥘", "🍕"],
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  travel: {
    icon: "✈️",
    emoji: "🌍",
    headerGradient: "linear-gradient(135deg, #457B9D 0%, #1D3557 50%, #264653 100%)",
    bubbleGradient: "linear-gradient(135deg, #EDF6F9 0%, #D6EAF0 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #457B9D 0%, #1D3557 100%)",
    pattern: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40 Q20 20 40 40 T80 40' stroke='%23457B9D' stroke-width='0.5' fill='none' opacity='0.06'/%3E%3Cpath d='M0 60 Q20 40 40 60 T80 60' stroke='%23457B9D' stroke-width='0.5' fill='none' opacity='0.06'/%3E%3C/svg%3E\")",
    welcomeTitle: "Wanderlust Central",
    welcomeSubtitle: "The world is waiting. Share your adventures, discover hidden gems, and inspire others to explore.",
    floatingElements: ["✈️", "🗺️", "🏔️", "🌅"],
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  landmark: {
    icon: "🏛️",
    emoji: "🎭",
    headerGradient: "linear-gradient(135deg, #BC8F4F 0%, #8B6914 50%, #A0522D 100%)",
    bubbleGradient: "linear-gradient(135deg, #FFF8E7 0%, #FFF0D4 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #BC8F4F 0%, #8B6914 100%)",
    pattern: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 50 L10 30 L20 20 L20 50' stroke='%23BC8F4F' stroke-width='0.5' fill='none' opacity='0.08'/%3E%3Cpath d='M30 50 L30 25 L40 15 L40 50' stroke='%23BC8F4F' stroke-width='0.5' fill='none' opacity='0.08'/%3E%3C/svg%3E\")",
    welcomeTitle: "Heritage Hall",
    welcomeSubtitle: "Preserve the past, celebrate the present. Share stories of culture, tradition, and the beauty of our shared history.",
    floatingElements: ["🏛️", "🎭", "📜", "🕰️"],
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  flask: {
    icon: "🧪",
    emoji: "🔬",
    headerGradient: "linear-gradient(135deg, #2A9D8F 0%, #264653 50%, #1D3557 100%)",
    bubbleGradient: "linear-gradient(135deg, #E8F6F3 0%, #D0ECE7 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #2A9D8F 0%, #264653 100%)",
    pattern: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1' fill='%232A9D8F' opacity='0.12'/%3E%3Ccircle cx='5' cy='5' r='0.8' fill='%232A9D8F' opacity='0.08'/%3E%3Ccircle cx='35' cy='35' r='0.8' fill='%232A9D8F' opacity='0.08'/%3E%3C/svg%3E\")",
    welcomeTitle: "The Laboratory",
    welcomeSubtitle: "Question everything, discover something. Dive into discussions about science, experiments, and the wonders of our universe.",
    floatingElements: ["🧪", "⚡", "🔭", "🌌"],
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  brain: {
    icon: "🧠",
    emoji: "💭",
    headerGradient: "linear-gradient(135deg, #7B68EE 0%, #5B3FC0 50%, #4A2FB5 100%)",
    bubbleGradient: "linear-gradient(135deg, #F5F0FF 0%, #EDE5FF 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #7B68EE 0%, #5B3FC0 100%)",
    pattern: "url(\"data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 10 Q35 10 35 25 Q35 40 25 40 Q15 40 15 25 Q15 10 25 10' stroke='%237B68EE' stroke-width='0.5' fill='none' opacity='0.08'/%3E%3C/svg%3E\")",
    welcomeTitle: "The Mind Café",
    welcomeSubtitle: "Explore the depths of human behavior. Discuss psychology, emotions, and what makes us who we are.",
    floatingElements: ["🧠", "💡", "🔮", "🌙"],
    fontFamily: "'Inter', system-ui, sans-serif",
  },
};

// Floating decorative element component
function FloatingElement({ emoji, delay, duration, startX }: { emoji: string; delay: number; duration: number; startX: number }) {
  return (
    <motion.div
      className="absolute text-2xl pointer-events-none select-none opacity-20"
      initial={{ y: "100vh", x: startX, opacity: 0 }}
      animate={{
        y: "-10vh",
        x: [startX, startX + 30, startX - 20, startX + 10, startX],
        opacity: [0, 0.2, 0.2, 0.15, 0],
        rotate: [0, 15, -10, 5, 0],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{ left: `${startX}%` }}
    >
      {emoji}
    </motion.div>
  );
}

export default function CommunityChat({ community, onClose }: CommunityChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [theme, setTheme] = useState<ChatTheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [typingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUserId = useRef(`user_${Math.random().toString(36).slice(2, 9)}`);
  const currentUserName = useRef(`Guest ${Math.floor(Math.random() * 1000)}`);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchTheme = useCallback(async () => {
    const { data } = await supabase
      .from("community_chat_themes")
      .select("*")
      .eq("community_id", community.id)
      .single();
    if (data) setTheme(data as ChatTheme);
  }, [community.id]);

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase
      .from("community_messages")
      .select("*")
      .eq("community_id", community.id)
      .order("created_at", { ascending: true });
    if (data) setMessages(data as ChatMessage[]);
    setLoading(false);
  }, [community.id]);

  useEffect(() => {
    fetchTheme();
    fetchMessages();

    const subscription = supabase
      .channel(`community_chat_${community.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "community_messages",
          filter: `community_id=eq.${community.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [community.id, fetchTheme, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() && !selectedImage) return;

    setSending(true);
    const messageData = {
      community_id: community.id,
      sender_id: currentUserId.current,
      sender_name: currentUserName.current,
      sender_avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUserId.current}`,
      content: newMessage.trim(),
      media_url: selectedImage,
    };

    const { error } = await supabase.from("community_messages").insert(messageData);

    if (!error) {
      setNewMessage("");
      setSelectedImage(null);
    }
    setSending(false);
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    setUploadingImage(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${community.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("community-chat-images")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("community-chat-images")
      .getPublicUrl(fileName);

    setSelectedImage(urlData.publicUrl);
    setUploadingImage(false);
  };

  const themeConfig = THEME_CONFIG[theme?.background_pattern || "books"] || THEME_CONFIG.books;
  const themeColor = theme?.primary_color || community.color;
  const secondaryColor = theme?.secondary_color || "#FFF8F0";

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const isOwnMessage = (msg: ChatMessage) => msg.sender_id === currentUserId.current;

  const shouldShowDate = (msg: ChatMessage, index: number) => {
    if (index === 0) return true;
    const prevDate = new Date(messages[index - 1].created_at).toDateString();
    const currDate = new Date(msg.created_at).toDateString();
    return prevDate !== currDate;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: secondaryColor }}>
      {/* Animated Background Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: themeConfig.pattern,
            backgroundColor: secondaryColor,
          }}
        />
        {/* Floating decorative elements */}
        {themeConfig.floatingElements.map((emoji, i) => (
          <FloatingElement
            key={i}
            emoji={emoji}
            delay={i * 3}
            duration={15 + i * 3}
            startX={10 + i * 22}
          />
        ))}
        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${themeColor}08 0%, transparent 60%)`,
          }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative z-10 flex items-center gap-3 px-4 py-3.5 shadow-lg flex-shrink-0"
        style={{
          background: themeConfig.headerGradient,
        }}
      >
        <button
          onClick={onClose}
          className="p-2.5 rounded-xl transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <motion.div
          className="text-3xl"
          animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
        >
          {themeConfig.icon}
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-white text-sm truncate" style={{ fontFamily: themeConfig.fontFamily }}>
              {community.name}
            </h2>
            <Hash className="w-3 h-3 text-white/60" />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-white/80">{messages.length} messages</span>
            </div>
            <span className="text-white/40">|</span>
            <span className="text-xs text-white/70 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Live
            </span>
          </div>
        </div>

        {/* Online indicator dots */}
        <div className="flex -space-x-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-7 h-7 rounded-full border-2 border-white/30 flex items-center justify-center text-xs font-bold text-white"
              style={{ background: `${themeColor}${80 - i * 20}` }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              {String.fromCharCode(65 + i)}
            </motion.div>
          ))}
          <div className="w-7 h-7 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-xs text-white">
            +{Math.floor(Math.random() * 20 + 5)}
          </div>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-10 h-10" style={{ color: themeColor }} />
            </motion.div>
            <p className="text-sm text-gray-400">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-full text-center px-6"
          >
            {/* Welcome Card */}
            <div
              className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 max-w-sm w-full border shadow-xl overflow-hidden"
              style={{ borderColor: `${themeColor}20` }}
            >
              {/* Decorative top bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ background: themeConfig.headerGradient }}
              />

              <motion.div
                className="text-7xl mb-4"
                animate={{ y: [0, -8, 0], rotate: [0, 3, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
              >
                {themeConfig.emoji}
              </motion.div>

              <h3
                className="text-xl font-bold mb-3"
                style={{ color: themeColor, fontFamily: themeConfig.fontFamily }}
              >
                {themeConfig.welcomeTitle}
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                {themeConfig.welcomeSubtitle}
              </p>

              <div className="flex items-center justify-center gap-3 text-2xl">
                {themeConfig.floatingElements.slice(0, 4).map((emoji, i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Be the first to start the conversation!
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-1 max-w-2xl mx-auto">
            <AnimatePresence>
              {messages.map((msg, index) => {
                const own = isOwnMessage(msg);
                const showAvatar = index === 0 || messages[index - 1].sender_id !== msg.sender_id;
                const showDateDivider = shouldShowDate(msg, index);

                return (
                  <div key={msg.id}>
                    {/* Date Divider */}
                    {showDateDivider && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center my-4"
                      >
                        <div className="px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border shadow-sm">
                          <span className="text-xs font-medium text-gray-500">
                            {formatDate(msg.created_at)}
                          </span>
                        </div>
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className={`flex ${own ? "justify-end" : "justify-start"} mb-1`}
                    >
                      <div className={`flex gap-2.5 max-w-[88%] ${own ? "flex-row-reverse" : "flex-row"}`}>
                        {/* Avatar with status ring */}
                        {showAvatar && (
                          <div className="flex flex-col items-center flex-shrink-0 mt-1">
                            <div className="relative">
                              <img
                                src={msg.sender_avatar}
                                alt={msg.sender_name}
                                className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                              />
                              <div
                                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                                style={{ backgroundColor: "#22c55e" }}
                              />
                            </div>
                          </div>
                        )}
                        {!showAvatar && <div className="w-9 flex-shrink-0" />}

                        {/* Message Content */}
                        <div className="flex flex-col">
                          {showAvatar && (
                            <span
                              className={`text-xs font-medium text-gray-400 mb-1 ${own ? "text-right mr-1" : "ml-1"}`}
                            >
                              {msg.sender_name}
                            </span>
                          )}

                          <div className="relative group">
                            <div
                              className={`px-4 py-2.5 rounded-2xl shadow-sm transition-all duration-200 group-hover:shadow-md ${
                                own
                                  ? "rounded-br-md text-white"
                                  : "rounded-bl-md text-gray-800 border"
                              }`}
                              style={{
                                background: own ? themeConfig.ownBubbleGradient : themeConfig.bubbleGradient,
                                borderColor: own ? "transparent" : `${themeColor}25`,
                              }}
                            >
                              {msg.media_url && (
                                <div className="mb-2.5 -mx-1">
                                  <motion.img
                                    src={msg.media_url}
                                    alt="Shared image"
                                    className="rounded-xl max-w-full max-h-56 object-cover cursor-pointer"
                                    onClick={() => {
                                      setSelectedImage(msg.media_url);
                                      setShowImagePreview(true);
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                  />
                                </div>
                              )}
                              {msg.content && (
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                              )}
                              <div className={`flex items-center gap-1.5 mt-1.5 ${own ? "justify-end" : "justify-start"}`}>
                                <span
                                  className={`text-[10px] ${own ? "text-white/60" : "text-gray-400"}`}
                                >
                                  {formatTime(msg.created_at)}
                                </span>
                                {own && (
                                  <svg className="w-3 h-3 text-white/60" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14A6 6 0 118 2a6 6 0 010 12z" />
                                  </svg>
                                )}
                              </div>
                            </div>

                            {/* Reaction hint on hover */}
                            <motion.div
                              className={`absolute -bottom-3 ${own ? "left-0" : "right-0"} opacity-0 group-hover:opacity-100 transition-opacity`}
                              initial={false}
                            >
                              <div className="flex gap-1 bg-white rounded-full shadow-md px-1.5 py-0.5 border border-gray-100">
                                {["❤️", "👍", "😂", "🔥"].map((r) => (
                                  <button key={r} className="text-xs hover:scale-125 transition-transform">
                                    {r}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </AnimatePresence>

            {/* Typing indicator */}
            <AnimatePresence>
              {typingUsers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-center gap-2 ml-12 mt-2"
                >
                  <div className="flex gap-1 bg-white/80 backdrop-blur-sm rounded-2xl px-3 py-2 border shadow-sm" style={{ borderColor: `${themeColor}20` }}>
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: themeColor }}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: themeColor }}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                    />
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: themeColor }}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">Someone is typing...</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Image Preview Bar */}
      <AnimatePresence>
        {selectedImage && !showImagePreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative z-10 px-4 py-2.5 bg-white/90 backdrop-blur-md border-t flex-shrink-0"
            style={{ borderColor: `${themeColor}20` }}
          >
            <div className="max-w-2xl mx-auto flex items-center gap-3">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-14 h-14 rounded-xl object-cover border-2 shadow-sm"
                  style={{ borderColor: `${themeColor}30` }}
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors shadow-md"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
              <span className="text-sm text-gray-500 font-medium">Image ready to send</span>
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
                <span className="text-xs text-gray-400">{selectedImage.length > 100 ? "Base64" : "URL"}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
        className="relative z-10 bg-white/95 backdrop-blur-md border-t px-4 py-3.5 flex-shrink-0"
        style={{ borderColor: `${themeColor}15` }}
      >
        <div className="max-w-2xl mx-auto flex items-end gap-2.5">
          {/* Image Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            className="p-3 rounded-2xl transition-all flex-shrink-0"
            style={{
              backgroundColor: `${themeColor}12`,
              color: themeColor,
            }}
          >
            {uploadingImage ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Image className="w-5 h-5" />
            )}
          </motion.button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={`Message ${community.name}...`}
              className="w-full px-5 py-3.5 rounded-2xl border outline-none transition-all text-sm"
              style={{
                borderColor: `${themeColor}25`,
                backgroundColor: secondaryColor,
                color: "#374151",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = themeColor;
                e.target.style.boxShadow = `0 0 0 4px ${themeColor}15`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = `${themeColor}25`;
                e.target.style.boxShadow = "none";
              }}
            />
            {/* Character count */}
            {newMessage.length > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-300 pointer-events-none">
                {newMessage.length}
              </span>
            )}
          </div>

          {/* Send Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleSend}
            disabled={sending || (!newMessage.trim() && !selectedImage)}
            className="p-3.5 rounded-2xl text-white transition-all disabled:opacity-40 disabled:hover:scale-100 flex-shrink-0 shadow-lg"
            style={{
              background: themeConfig.headerGradient,
              boxShadow: `0 4px 14px ${themeColor}40`,
            }}
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Full Image Preview Modal */}
      <AnimatePresence>
        {showImagePreview && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/85 flex items-center justify-center p-4"
            onClick={() => setShowImagePreview(false)}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative"
            >
              <img
                src={selectedImage}
                alt="Full preview"
                className="max-w-[90vw] max-h-[85vh] rounded-2xl object-contain shadow-2xl"
              />
              <button
                onClick={() => setShowImagePreview(false)}
                className="absolute -top-3 -right-3 p-2.5 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
