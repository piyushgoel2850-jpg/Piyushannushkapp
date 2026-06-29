import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Image,
  X,
  ChevronLeft,
  Loader2,
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

const PATTERNS: Record<string, string> = {
  books: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
  feather: "url(\"data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.03'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6h2c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm0 0c0 2.21-1.79 4-4 4-3.314 0-6 2.686-6 6h2c0-2.21 1.79-4 4-4 3.314 0 6-2.686 6-6 0-2.21 1.79-4 4-4 3.314 0 6-2.686 6-6h2c0 2.21-1.79 4-4 4-3.314 0-6 2.686-6 6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
  music: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.03' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
  guitar: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")",
  food: "url(\"data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h16v16H0z' fill='%23000' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E\")",
  travel: "url(\"data:image/svg+xml,%3Csvg width='32' height='64' viewBox='0 0 32 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 28h20v2h-20zM0 40h20v2h-20zM0 52h20v2h-20z' fill='%23000' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E\")",
  landmark: "url(\"data:image/svg+xml,%3Csvg width='48' height='32' viewBox='0 0 48 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.03'%3E%3Cpath d='M27 32c0-3.314-2.686-6-6-6s-6 2.686-6 6h12zm17 0c0-3.314-2.686-6-6-6s-6 2.686-6 6h12zM0 32c0-3.314 2.686-6 6-6s6 2.686 6 6H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
  flask: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.03' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
  brain: "url(\"data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M5 0h1v1H5zM0 5h1v1H0z'/%3E%3C/g%3E%3C/svg%3E\")",
};

const THEME_ICONS: Record<string, string> = {
  books: "📚",
  feather: "🪶",
  music: "🎵",
  guitar: "🎸",
  food: "🍳",
  travel: "✈️",
  landmark: "🏛️",
  flask: "🧪",
  brain: "🧠",
};

export default function CommunityChat({ community, onClose }: CommunityChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [theme, setTheme] = useState<ChatTheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUserId = useRef(`user_${Math.random().toString(36).slice(2, 9)}`);
  const currentUserName = useRef(`Guest ${Math.floor(Math.random() * 1000)}`);

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
      // Try to create bucket if it doesn't exist - for demo use data URL
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

  const themeColor = theme?.primary_color || community.color;
  const secondaryColor = theme?.secondary_color || "#FFF8F0";
  // accent color available for future theme extensions
  theme?.accent_color || "#C9B1FF";
  const pattern = theme?.background_pattern || "books";
  const themeIcon = THEME_ICONS[pattern] || "💬";

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const isOwnMessage = (msg: ChatMessage) => msg.sender_id === currentUserId.current;

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: secondaryColor }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b shadow-sm flex-shrink-0"
        style={{
          backgroundColor: themeColor,
          borderColor: `${themeColor}50`,
        }}
      >
        <button
          onClick={onClose}
          className="p-2 rounded-xl transition-colors hover:bg-white/20"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div className="text-2xl">{themeIcon}</div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-white text-sm truncate">{community.name} Chat</h2>
          <p className="text-xs text-white/80">
            {messages.length} messages
          </p>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-white/80">Live</span>
        </div>
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4"
        style={{
          backgroundImage: PATTERNS[pattern] || PATTERNS.books,
          backgroundColor: secondaryColor,
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: themeColor }} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">{themeIcon}</div>
            <h3 className="font-bold text-gray-700 mb-2">Welcome to {community.name}!</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              Be the first to start a conversation. Share your thoughts, ask questions, or connect with fellow enthusiasts!
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            <AnimatePresence>
              {messages.map((msg, index) => {
                const own = isOwnMessage(msg);
                const showAvatar =
                  index === 0 || messages[index - 1].sender_id !== msg.sender_id;

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${own ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex gap-2 max-w-[85%] ${own ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {/* Avatar */}
                      {showAvatar && (
                        <img
                          src={msg.sender_avatar}
                          alt={msg.sender_name}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1"
                        />
                      )}
                      {!showAvatar && <div className="w-8 flex-shrink-0" />}

                      {/* Message Bubble */}
                      <div className="flex flex-col">
                        {showAvatar && (
                          <span
                            className={`text-xs text-gray-500 mb-1 ${own ? "text-right" : "text-left"}`}
                          >
                            {msg.sender_name}
                          </span>
                        )}
                        <div
                          className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                            own
                              ? "rounded-br-md text-white"
                              : "rounded-bl-md text-gray-800 border"
                          }`}
                          style={{
                            backgroundColor: own ? themeColor : "white",
                            borderColor: own ? "transparent" : `${themeColor}30`,
                          }}
                        >
                          {msg.media_url && (
                            <div className="mb-2">
                              <img
                                src={msg.media_url}
                                alt="Shared image"
                                className="rounded-xl max-w-full max-h-48 object-cover cursor-pointer"
                                onClick={() => {
                                  setSelectedImage(msg.media_url);
                                  setShowImagePreview(true);
                                }}
                              />
                            </div>
                          )}
                          {msg.content && (
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                          )}
                          <span
                            className={`text-xs mt-1 block ${
                              own ? "text-white/70" : "text-gray-400"
                            }`}
                          >
                            {formatTime(msg.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Image Preview Overlay */}
      {selectedImage && !showImagePreview && (
        <div className="px-4 py-2 bg-white border-t flex-shrink-0">
          <div className="max-w-2xl mx-auto flex items-center gap-2">
            <div className="relative">
              <img
                src={selectedImage}
                alt="Preview"
                className="w-16 h-16 rounded-lg object-cover"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
            <span className="text-sm text-gray-500">Image ready to send</span>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t px-4 py-3 flex-shrink-0">
        <div className="max-w-2xl mx-auto flex items-end gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            className="p-2.5 rounded-xl transition-colors hover:bg-gray-100 flex-shrink-0"
            style={{ color: themeColor }}
          >
            {uploadingImage ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Image className="w-5 h-5" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Type a message..."
              className="w-full px-4 py-3 rounded-2xl border outline-none transition-all text-sm"
              style={{
                borderColor: `${themeColor}40`,
                backgroundColor: secondaryColor,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = themeColor;
                e.target.style.boxShadow = `0 0 0 3px ${themeColor}20`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = `${themeColor}40`;
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={sending || (!newMessage.trim() && !selectedImage)}
            className="p-3 rounded-2xl text-white transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex-shrink-0"
            style={{ backgroundColor: themeColor }}
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Full Image Preview Modal */}
      <AnimatePresence>
        {showImagePreview && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4"
            onClick={() => setShowImagePreview(false)}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage}
              alt="Full preview"
              className="max-w-full max-h-full rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setShowImagePreview(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
