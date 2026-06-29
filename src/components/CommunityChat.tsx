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

/* ============================================================
   LIVING AESTHETIC ROOMS — Each community is a tiny world
   ============================================================ */

interface RoomTheme {
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
  roomVibe: string;
  stickerSet: string[];
  messageBubbleStyle: "rounded" | "torn" | "cassette" | "journal" | "recipe" | "sketch" | "dialogue" | "ticket" | "note" | "card" | "dream";
  ambientEffect: "none" | "steam" | "fireflies" | "shootingStars" | "spotlight" | "pixelClouds";
}

const ROOMS: Record<string, RoomTheme> = {
  // ─── 1. BOOKSTAGRAM DREAM ─── Cottagecore x Academia x Bookstagram
  bookstagram: {
    icon: "📖",
    emoji: "📚",
    headerGradient: "linear-gradient(135deg, #D4A5A5 0%, #C9B8A8 30%, #B8C5D6 60%, #D4C5B0 100%)",
    bubbleGradient: "linear-gradient(135deg, #FDF6E3 0%, #F5EDE0 50%, #EDE5D8 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #D4A5A5 0%, #C9B8A8 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 30 Q30 10 50 30 T90 30' stroke='%23D4A5A5' stroke-width='0.4' fill='none' opacity='0.06'/%3E%3Cpath d='M20 70 Q40 50 60 70 T100 70' stroke='%23B8C5D6' stroke-width='0.4' fill='none' opacity='0.06'/%3E%3Cpath d='M5 100 Q25 80 45 100 T85 100' stroke='%23C9B8A8' stroke-width='0.4' fill='none' opacity='0.06'/%3E%3C/svg%3E")`,
    welcomeTitle: "Welcome to the Reading Nook",
    welcomeSubtitle: "Every great conversation starts with a single word. Share your thoughts on books, stories, and the magic of reading.",
    floatingElements: ["📖", "✨", "☕", "🕯️", "🌸", "🔖"],
    fontFamily: "'Playfair Display', Georgia, serif",
    roomVibe: "Cozy library with warm lamplight",
    stickerSet: ["📚", "☕", "🐈", "🕯️", "🌙", "✒️"],
    messageBubbleStyle: "torn",
    ambientEffect: "none",
  },

  // ─── 2. MIDNIGHT VINYL ─── Spotify Wrapped x Retro Synthwave
  midnight_vinyl: {
    icon: "🎵",
    emoji: "🎧",
    headerGradient: "linear-gradient(135deg, #1A0A2E 0%, #2D1B4E 30%, #7B2D8E 60%, #FF6B9D 100%)",
    bubbleGradient: "linear-gradient(135deg, #1E1238 0%, #2A1A4A 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #7B2D8E 0%, #FF6B9D 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='1' fill='%237B2D8E' opacity='0.15'/%3E%3Ccircle cx='10' cy='10' r='0.6' fill='%23FF6B9D' opacity='0.1'/%3E%3Ccircle cx='50' cy='50' r='0.6' fill='%23FF6B9D' opacity='0.1'/%3E%3C/svg%3E")`,
    welcomeTitle: "The Studio is Live",
    welcomeSubtitle: "Welcome to the midnight session. Share your tracks, discover new sounds, and vibe with producers worldwide.",
    floatingElements: ["🎵", "🎸", "✨", "🌙", "🎹", "🎧"],
    fontFamily: "'Inter', system-ui, sans-serif",
    roomVibe: "Neon-lit music studio at midnight",
    stickerSet: ["🎵", "🔥", "🎸", "💿", "🌟", "🎤"],
    messageBubbleStyle: "cassette",
    ambientEffect: "none",
  },

  // ─── 3. PASSPORT TO EVERYWHERE ─── Wanderlust x Adventure Journal
  passport: {
    icon: "✈️",
    emoji: "🗺️",
    headerGradient: "linear-gradient(135deg, #4A90A4 0%, #5BA4B8 30%, #E8734A 70%, #F4A261 100%)",
    bubbleGradient: "linear-gradient(135deg, #FFF8F0 0%, #FFF0E0 50%, #FFEDD5 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #4A90A4 0%, #E8734A 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q25 30 50 50 T100 50' stroke='%234A90A4' stroke-width='0.4' fill='none' opacity='0.05'/%3E%3Cpath d='M0 70 Q25 50 50 70 T100 70' stroke='%23E8734A' stroke-width='0.4' fill='none' opacity='0.05'/%3E%3C/svg%3E")`,
    welcomeTitle: "Your Adventure Awaits",
    welcomeSubtitle: "The world is waiting. Share your journeys, discover hidden gems, and inspire others to explore.",
    floatingElements: ["✈️", "🗺️", "🏔️", "🌅", "📸", "🧭"],
    fontFamily: "'Inter', system-ui, sans-serif",
    roomVibe: "Travel scrapbook with polaroids and stamps",
    stickerSet: ["✈️", "🏔️", "📸", "🌊", "🎒", "🗺️"],
    messageBubbleStyle: "journal",
    ambientEffect: "none",
  },

  // ─── 4. CUTE CAFE SOCIETY ─── Cozy Cafe x Food Blogger x Kawaii
  cafe_society: {
    icon: "🍜",
    emoji: "☕",
    headerGradient: "linear-gradient(135deg, #E8A87C 0%, #F4C2A1 30%, #88D8B0 60%, #C8E6C9 100%)",
    bubbleGradient: "linear-gradient(135deg, #FFF5F0 0%, #FFEEE5 50%, #FFF0E8 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #E8A87C 0%, #88D8B0 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1.5' fill='%23E8A87C' opacity='0.1'/%3E%3Ccircle cx='5' cy='5' r='1' fill='%2388D8B0' opacity='0.08'/%3E%3Ccircle cx='35' cy='35' r='1' fill='%2388D8B0' opacity='0.08'/%3E%3C/svg%3E")`,
    welcomeTitle: "Welcome to Our Cafe",
    welcomeSubtitle: "Good food, great company. Share recipes, cooking tips, and the joy of creating delicious moments together.",
    floatingElements: ["☕", "🍰", "🍜", "🌿", "🥐", "🍓"],
    fontFamily: "'Inter', system-ui, sans-serif",
    roomVibe: "Cheerful cafe with pastries and warm light",
    stickerSet: ["☕", "🍰", "🍜", "🌶️", "🥢", "🍕"],
    messageBubbleStyle: "recipe",
    ambientEffect: "steam",
  },

  // ─── 5. CREATIVE STUDIO ─── Sketchbook x Pinterest Art Room
  creative_studio: {
    icon: "🎨",
    emoji: "✨",
    headerGradient: "linear-gradient(135deg, #B8A9C9 0%, #C5B8D4 30%, #FFE66D 60%, #FFD93D 100%)",
    bubbleGradient: "linear-gradient(135deg, #F8F6FF 0%, #F0EDFF 50%, #E8E3F3 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #B8A9C9 0%, #FFE66D 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 20 Q30 5 50 20 T80 20' stroke='%23B8A9C9' stroke-width='0.5' fill='none' opacity='0.08'/%3E%3Cpath d='M0 40 Q20 25 40 40 T80 40' stroke='%23FFE66D' stroke-width='0.5' fill='none' opacity='0.06'/%3E%3Cpath d='M10 60 Q30 45 50 60 T80 60' stroke='%23B8A9C9' stroke-width='0.5' fill='none' opacity='0.08'/%3E%3C/svg%3E")`,
    welcomeTitle: "Your Canvas Awaits",
    welcomeSubtitle: "A space where creativity flows freely. Share your art, find inspiration, and create magic together.",
    floatingElements: ["🎨", "✏️", "🖌️", "✨", "🌈", "🎭"],
    fontFamily: "'Inter', system-ui, sans-serif",
    roomVibe: "Artist's desk with paint splashes and sketchbooks",
    stickerSet: ["🎨", "✏️", "🖌️", "✨", "🌟", "💫"],
    messageBubbleStyle: "sketch",
    ambientEffect: "none",
  },

  // ─── 6. PIXEL ARCADE ─── Cozy Gaming x Pixel Art
  pixel_arcade: {
    icon: "🎮",
    emoji: "👾",
    headerGradient: "linear-gradient(135deg, #1A202C 0%, #2D3748 30%, #4A5568 60%, #00D4AA 100%)",
    bubbleGradient: "linear-gradient(135deg, #1A202C 0%, #2D3748 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #00D4AA 0%, #00B894 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='2' height='2' fill='%2300D4AA' opacity='0.08'/%3E%3Crect x='16' y='16' width='2' height='2' fill='%2300D4AA' opacity='0.08'/%3E%3C/svg%3E")`,
    welcomeTitle: "Player One Ready",
    welcomeSubtitle: "Welcome to the arcade! Share gameplay, find teammates, and level up together in this cozy gaming world.",
    floatingElements: ["🎮", "⭐", "💎", "🎯", "🕹️", "👾"],
    fontFamily: "'Inter', system-ui, sans-serif",
    roomVibe: "Retro arcade with neon glow",
    stickerSet: ["🎮", "🏆", "⭐", "💎", "🔥", "⚡"],
    messageBubbleStyle: "dialogue",
    ambientEffect: "pixelClouds",
  },

  // ─── 7. CINEMA LOUNGE ─── Old Hollywood x Movie Club
  cinema_lounge: {
    icon: "🎬",
    emoji: "🍿",
    headerGradient: "linear-gradient(135deg, #8B2635 0%, #A03045 30%, #D4AF37 70%, #F4E4A6 100%)",
    bubbleGradient: "linear-gradient(135deg, #1A1A2E 0%, #252542 50%, #30305A 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #8B2635 0%, #D4AF37 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='2' y='2' width='8' height='12' rx='1' stroke='%23D4AF37' stroke-width='0.4' fill='none' opacity='0.08'/%3E%3Crect x='18' y='2' width='8' height='12' rx='1' stroke='%23D4AF37' stroke-width='0.4' fill='none' opacity='0.08'/%3E%3Crect x='34' y='2' width='8' height='12' rx='1' stroke='%23D4AF37' stroke-width='0.4' fill='none' opacity='0.08'/%3E%3Crect x='50' y='2' width='8' height='12' rx='1' stroke='%23D4AF37' stroke-width='0.4' fill='none' opacity='0.08'/%3E%3C/svg%3E")`,
    welcomeTitle: "The Show Begins",
    welcomeSubtitle: "Welcome to the Cinema Lounge. Discuss films, series, and the magic of storytelling in luxurious comfort.",
    floatingElements: ["🎬", "🍿", "⭐", "🎭", "✨", "🎪"],
    fontFamily: "'Playfair Display', Georgia, serif",
    roomVibe: "Old Hollywood theater with velvet seats",
    stickerSet: ["🎬", "🍿", "⭐", "🎭", "🎪", "🏆"],
    messageBubbleStyle: "ticket",
    ambientEffect: "spotlight",
  },

  // ─── 8. FOREST WHISPER ─── Nature Journal x Cottagecore
  forest_whisper: {
    icon: "🌿",
    emoji: "🦋",
    headerGradient: "linear-gradient(135deg, #6B8E6B 0%, #7BA05B 30%, #87CEEB 70%, #A8D5E5 100%)",
    bubbleGradient: "linear-gradient(135deg, #F5F5DC 0%, #EBEBC0 50%, #E0E0B0 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #6B8E6B 0%, #87CEEB 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 80 Q30 60 40 80' stroke='%236B8E6B' stroke-width='0.5' fill='none' opacity='0.1'/%3E%3Cpath d='M60 70 Q70 50 80 70' stroke='%236B8E6B' stroke-width='0.5' fill='none' opacity='0.1'/%3E%3Cpath d='M10 30 Q20 10 30 30' stroke='%2387CEEB' stroke-width='0.5' fill='none' opacity='0.08'/%3E%3C/svg%3E")`,
    welcomeTitle: "Welcome to the Forest",
    welcomeSubtitle: "A peaceful digital forest where nature lovers gather. Share hikes, plant care tips, and outdoor moments.",
    floatingElements: ["🌿", "🦋", "🍃", "🌸", "🌲", "☀️"],
    fontFamily: "'Inter', system-ui, sans-serif",
    roomVibe: "Sunlit forest clearing with wildflowers",
    stickerSet: ["🌿", "🦋", "🌸", "🍄", "🌲", "☀️"],
    messageBubbleStyle: "note",
    ambientEffect: "fireflies",
  },

  // ─── 9. MEMORY GARDEN ─── Scrapbook x Friendship Journal
  memory_garden: {
    icon: "🌸",
    emoji: "💌",
    headerGradient: "linear-gradient(135deg, #E8B4B8 0%, #F4C2C2 30%, #D4AF37 70%, #F4E8C1 100%)",
    bubbleGradient: "linear-gradient(135deg, #FFF0F5 0%, '#FFE4EC' 50%, #FFD6E8 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #E8B4B8 0%, #D4AF37 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 10 Q50 25 40 40 Q30 25 40 10' stroke='%23E8B4B8' stroke-width='0.4' fill='none' opacity='0.08'/%3E%3Cpath d='M20 50 Q30 65 20 80 Q10 65 20 50' stroke='%23D4AF37' stroke-width='0.4' fill='none' opacity='0.06'/%3E%3C/svg%3E")`,
    welcomeTitle: "Our Memory Garden",
    welcomeSubtitle: "A garden of human connections. Celebrate friendships, relationships, and the beautiful moments we share.",
    floatingElements: ["🌸", "💌", "✨", "💖", "🌙", "💫"],
    fontFamily: "'Inter', system-ui, sans-serif",
    roomVibe: "Enchanted garden with fairy lights",
    stickerSet: ["💖", "🌸", "✨", "💌", "🌙", "💫"],
    messageBubbleStyle: "note",
    ambientEffect: "shootingStars",
  },

  // ─── 10. FOCUS HAVEN ─── StudyTok x Digital Planner
  focus_haven: {
    icon: "📚",
    emoji: "🎯",
    headerGradient: "linear-gradient(135deg, #8FA5B8 0%, '#A0B5C8' 30%, #7BAE7F 70%, #90C695 100%)",
    bubbleGradient: "linear-gradient(135deg, #F5F5F0 0%, #EBEBE5 50%, #E0E0D8 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #8FA5B8 0%, #7BAE7F 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='5' y='5' width='40' height='40' rx='2' stroke='%238FA5B8' stroke-width='0.3' fill='none' opacity='0.06'/%3E%3Cline x1='5' y1='15' x2='45' y2='15' stroke='%238FA5B8' stroke-width='0.2' opacity='0.05'/%3E%3Cline x1='5' y1='25' x2='45' y2='25' stroke='%238FA5B8' stroke-width='0.2' opacity='0.05'/%3E%3Cline x1='5' y1='35' x2='45' y2='35' stroke='%238FA5B8' stroke-width='0.2' opacity='0.05'/%3E%3C/svg%3E")`,
    welcomeTitle: "Focus Mode: On",
    welcomeSubtitle: "A warm productivity space. Study together, share tips, and stay motivated with fellow learners.",
    floatingElements: ["📚", "✏️", "🎯", "☕", "💡", "📖"],
    fontFamily: "'Inter', system-ui, sans-serif",
    roomVibe: "Cozy study room with desk lamp glow",
    stickerSet: ["📚", "✅", "💡", "☕", "🎯", "✨"],
    messageBubbleStyle: "card",
    ambientEffect: "none",
  },

  // ─── 11. AESTHETIC SOCIAL UNIVERSE ─── Pinterest Board x Digital Dreamland
  aesthetic_universe: {
    icon: "🌟",
    emoji: "✨",
    headerGradient: "linear-gradient(135deg, #F4A6B5 0%, #FAD0C4 25%, #FDE68A 50%, '#A7C7E7' 75%, #C5B8E0 100%)",
    bubbleGradient: "linear-gradient(135deg, #FFF5F7 0%, #FFF0F5 50%, #F8F0FF 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #F4A6B5 0%, #FDE68A 50%, #A7C7E7 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20 Q40 5 60 20 T100 20' stroke='%23F4A6B5' stroke-width='0.4' fill='none' opacity='0.06'/%3E%3Cpath d='M0 50 Q25 35 50 50 T100 50' stroke='%23FDE68A' stroke-width='0.4' fill='none' opacity='0.06'/%3E%3Cpath d='M20 80 Q40 65 60 80 T100 80' stroke='%23A7C7E7' stroke-width='0.4' fill='none' opacity='0.06'/%3E%3C/svg%3E")`,
    welcomeTitle: "Welcome to the Universe",
    welcomeSubtitle: "A dreamy space for everything beautiful. Share art, music, moments, and anything that sparks joy.",
    floatingElements: ["✨", "🌸", "📖", "🎵", "✈️", "🎨"],
    fontFamily: "'Inter', system-ui, sans-serif",
    roomVibe: "Dreamy collage of everything beautiful",
    stickerSet: ["✨", "🌸", "💖", "🌟", "🌈", "💫"],
    messageBubbleStyle: "dream",
    ambientEffect: "none",
  },

  // ─── LEGACY FALLBACKS ───
  books: {
    icon: "📖",
    emoji: "📚",
    headerGradient: "linear-gradient(135deg, #D4A574 0%, #C49A6C 50%, #B8860B 100%)",
    bubbleGradient: "linear-gradient(135deg, #FDF6E3 0%, #FAEDCD 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #D4A574 0%, #C49A6C 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20 Q40 5 60 20 T100 20' stroke='%23D4A574' stroke-width='0.5' fill='none' opacity='0.08'/%3E%3Cpath d='M0 50 Q25 35 50 50 T100 50' stroke='%23D4A574' stroke-width='0.5' fill='none' opacity='0.08'/%3E%3C/svg%3E")`,
    welcomeTitle: "Welcome to the Library",
    welcomeSubtitle: "Every great conversation starts with a single word. Share your thoughts on books, stories, and the magic of reading.",
    floatingElements: ["📖", "✨", "🕯️", "☕"],
    fontFamily: "'Playfair Display', Georgia, serif",
    roomVibe: "Cozy library with warm lamplight",
    stickerSet: ["📚", "☕", "🐈", "🕯️"],
    messageBubbleStyle: "rounded",
    ambientEffect: "none",
  },
  feather: {
    icon: "🪶",
    emoji: "✍️",
    headerGradient: "linear-gradient(135deg, #9B7EDE 0%, #7B68EE 50%, #6B4EE6 100%)",
    bubbleGradient: "linear-gradient(135deg, #F3EFFF 0%, #E8E0FF 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #9B7EDE 0%, #7B68EE 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 Q30 0 50 10' stroke='%239B7EDE' stroke-width='0.5' fill='none' opacity='0.06'/%3E%3Cpath d='M0 30 Q20 20 40 30 T60 30' stroke='%239B7EDE' stroke-width='0.5' fill='none' opacity='0.06'/%3E%3C/svg%3E")`,
    welcomeTitle: "The Poetry Corner",
    welcomeSubtitle: "Where words dance and verses flow. Share your poetry, find inspiration, and connect with fellow wordsmiths.",
    floatingElements: ["🪶", "🌙", "✨", "📜"],
    fontFamily: "'Playfair Display', Georgia, serif",
    roomVibe: "Dreamy poetry salon",
    stickerSet: ["🪶", "🌙", "✨", "📜"],
    messageBubbleStyle: "rounded",
    ambientEffect: "none",
  },
  music: {
    icon: "🎵",
    emoji: "🎤",
    headerGradient: "linear-gradient(135deg, #4ECDC4 0%, #45B7AA 50%, #2E8B57 100%)",
    bubbleGradient: "linear-gradient(135deg, #E8F8F5 0%, #D4F1EA 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #4ECDC4 0%, #45B7AA 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1.5' fill='%234ECDC4' opacity='0.1'/%3E%3C/svg%3E")`,
    welcomeTitle: "The Stage is Yours",
    welcomeSubtitle: "Sing, share, and celebrate music together. Every voice matters in this community of melody.",
    floatingElements: ["🎵", "🎤", "🎶", "⭐"],
    fontFamily: "'Inter', system-ui, sans-serif",
    roomVibe: "Vibrant music studio",
    stickerSet: ["🎵", "🎤", "🎶", "⭐"],
    messageBubbleStyle: "rounded",
    ambientEffect: "none",
  },
  guitar: {
    icon: "🎸",
    emoji: "🤘",
    headerGradient: "linear-gradient(135deg, #F4A261 0%, #E76F51 50%, #D62828 100%)",
    bubbleGradient: "linear-gradient(135deg, #FFF5EB 0%, #FFE8D6 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 25 L50 25' stroke='%23F4A261' stroke-width='0.5' opacity='0.08'/%3E%3C/svg%3E")`,
    welcomeTitle: "Jam Central",
    welcomeSubtitle: "Grab your instrument and join the jam! Share riffs, get feedback, and rock out with fellow musicians.",
    floatingElements: ["🎸", "🔥", "🎵", "🥁"],
    fontFamily: "'Inter', system-ui, sans-serif",
    roomVibe: "Energetic jam space",
    stickerSet: ["🎸", "🔥", "🎵", "🥁"],
    messageBubbleStyle: "rounded",
    ambientEffect: "none",
  },
  food: {
    icon: "🍳",
    emoji: "👨‍🍳",
    headerGradient: "linear-gradient(135deg, #E76F51 0%, #D62828 50%, #C0392B 100%)",
    bubbleGradient: "linear-gradient(135deg, #FFF0ED 0%, #FFE0D8 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #E76F51 0%, #D62828 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='15' cy='15' r='2' fill='%23E76F51' opacity='0.08'/%3E%3C/svg%3E")`,
    welcomeTitle: "The Kitchen Table",
    welcomeSubtitle: "Good food, great company. Share recipes, cooking tips, and the joy of creating delicious moments.",
    floatingElements: ["🍳", "🌶️", "🥘", "🍕"],
    fontFamily: "'Inter', system-ui, sans-serif",
    roomVibe: "Warm kitchen gathering",
    stickerSet: ["🍳", "🌶️", "🥘", "🍕"],
    messageBubbleStyle: "rounded",
    ambientEffect: "steam",
  },
  travel: {
    icon: "✈️",
    emoji: "🌍",
    headerGradient: "linear-gradient(135deg, #457B9D 0%, #1D3557 50%, #264653 100%)",
    bubbleGradient: "linear-gradient(135deg, #EDF6F9 0%, #D6EAF0 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #457B9D 0%, #1D3557 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40 Q20 20 40 40 T80 40' stroke='%23457B9D' stroke-width='0.5' fill='none' opacity='0.06'/%3E%3C/svg%3E")`,
    welcomeTitle: "Wanderlust Central",
    welcomeSubtitle: "The world is waiting. Share your adventures, discover hidden gems, and inspire others to explore.",
    floatingElements: ["✈️", "🗺️", "🏔️", "🌅"],
    fontFamily: "'Inter', system-ui, sans-serif",
    roomVibe: "Adventure journal spread open",
    stickerSet: ["✈️", "🗺️", "🏔️", "🌅"],
    messageBubbleStyle: "rounded",
    ambientEffect: "none",
  },
  landmark: {
    icon: "🏛️",
    emoji: "🎭",
    headerGradient: "linear-gradient(135deg, #BC8F4F 0%, #8B6914 50%, #A0522D 100%)",
    bubbleGradient: "linear-gradient(135deg, #FFF8E7 0%, #FFF0D4 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #BC8F4F 0%, #8B6914 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 50 L10 30 L20 20 L20 50' stroke='%23BC8F4F' stroke-width='0.5' fill='none' opacity='0.08'/%3E%3C/svg%3E")`,
    welcomeTitle: "Heritage Hall",
    welcomeSubtitle: "Preserve the past, celebrate the present. Share stories of culture, tradition, and the beauty of our shared history.",
    floatingElements: ["🏛️", "🎭", "📜", "🕰️"],
    fontFamily: "'Playfair Display', Georgia, serif",
    roomVibe: "Historic museum hall",
    stickerSet: ["🏛️", "🎭", "📜", "🕰️"],
    messageBubbleStyle: "rounded",
    ambientEffect: "none",
  },
  flask: {
    icon: "🧪",
    emoji: "🔬",
    headerGradient: "linear-gradient(135deg, #2A9D8F 0%, #264653 50%, #1D3557 100%)",
    bubbleGradient: "linear-gradient(135deg, #E8F6F3 0%, #D0ECE7 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #2A9D8F 0%, #264653 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1' fill='%232A9D8F' opacity='0.12'/%3E%3C/svg%3E")`,
    welcomeTitle: "The Laboratory",
    welcomeSubtitle: "Question everything, discover something. Dive into discussions about science, experiments, and the wonders of our universe.",
    floatingElements: ["🧪", "⚡", "🔭", "🌌"],
    fontFamily: "'Inter', system-ui, sans-serif",
    roomVibe: "Modern science lab",
    stickerSet: ["🧪", "⚡", "🔭", "🌌"],
    messageBubbleStyle: "rounded",
    ambientEffect: "none",
  },
  brain: {
    icon: "🧠",
    emoji: "💭",
    headerGradient: "linear-gradient(135deg, #7B68EE 0%, #5B3FC0 50%, #4A2FB5 100%)",
    bubbleGradient: "linear-gradient(135deg, #F5F0FF 0%, #EDE5FF 100%)",
    ownBubbleGradient: "linear-gradient(135deg, #7B68EE 0%, #5B3FC0 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 10 Q35 10 35 25 Q35 40 25 40 Q15 40 15 25 Q15 10 25 10' stroke='%237B68EE' stroke-width='0.5' fill='none' opacity='0.08'/%3E%3C/svg%3E")`,
    welcomeTitle: "The Mind Cafe",
    welcomeSubtitle: "Explore the depths of human behavior. Discuss psychology, emotions, and what makes us who we are.",
    floatingElements: ["🧠", "💡", "🔮", "🌙"],
    fontFamily: "'Inter', system-ui, sans-serif",
    roomVibe: "Introspective lounge",
    stickerSet: ["🧠", "💡", "🔮", "🌙"],
    messageBubbleStyle: "rounded",
    ambientEffect: "none",
  },
};

// ─── Ambient Effect Components ───

function SteamEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 rounded-full bg-white/10"
          style={{
            left: `${20 + i * 20}%`,
            bottom: 0,
            height: `${40 + i * 15}px`,
          }}
          animate={{
            y: [0, -80, -160],
            opacity: [0, 0.3, 0],
            scaleY: [1, 1.5, 2],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

function FirefliesEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: i % 2 === 0 ? "#FFD700" : "#90EE90",
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            boxShadow: `0 0 6px ${i % 2 === 0 ? "#FFD700" : "#90EE90"}`,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.5],
            x: [0, (Math.random() - 0.5) * 60],
            y: [0, (Math.random() - 0.5) * 60],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function ShootingStarsEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px bg-gradient-to-r from-transparent via-white to-transparent"
          style={{
            width: "100px",
            top: `${15 + i * 25}%`,
            left: "-100px",
          }}
          animate={{
            x: ["0vw", "120vw"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 5 + 2,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

function SpotlightEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      <motion.div
        className="absolute w-64 h-64 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)",
          top: "20%",
          left: "50%",
        }}
        animate={{
          x: ["-50%", "-40%", "-60%", "-50%"],
          y: ["-50%", "-45%", "-55%", "-50%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

function PixelCloudsEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute flex gap-0.5"
          style={{
            top: `${10 + i * 18}%`,
            left: `${-20 + i * 10}%`,
          }}
          animate={{
            x: ["0vw", "120vw"],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            delay: i * 3,
            ease: "linear",
          }}
        >
          {[...Array(4)].map((_, j) => (
            <div
              key={j}
              className="w-2 h-2 bg-cyan-400/15 rounded-sm"
              style={{ marginTop: j % 2 === 0 ? 0 : 4 }}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
}

function AmbientEffect({ type }: { type: string }) {
  switch (type) {
    case "steam": return <SteamEffect />;
    case "fireflies": return <FirefliesEffect />;
    case "shootingStars": return <ShootingStarsEffect />;
    case "spotlight": return <SpotlightEffect />;
    case "pixelClouds": return <PixelCloudsEffect />;
    default: return null;
  }
}

// ─── Floating Element Component ───
function FloatingElement({ emoji, delay, duration, startX }: { emoji: string; delay: number; duration: number; startX: number }) {
  return (
    <motion.div
      className="absolute text-2xl pointer-events-none select-none"
      style={{ opacity: 0.18, left: `${startX}%` }}
      initial={{ y: "110vh" }}
      animate={{
        y: "-15vh",
        x: [0, 25, -15, 10, 0],
        opacity: [0, 0.18, 0.18, 0.12, 0],
        rotate: [0, 12, -8, 5, 0],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {emoji}
    </motion.div>
  );
}

// ─── Message Bubble Style Renderer ───
function getBubbleClasses(style: string, isOwn: boolean): string {
  const base = "px-4 py-2.5 shadow-sm transition-all duration-200 group-hover:shadow-md ";
  switch (style) {
    case "torn":
      return base + (isOwn
        ? "rounded-2xl rounded-br-sm "
        : "rounded-2xl rounded-bl-sm border border-dashed ");
    case "cassette":
      return base + (isOwn
        ? "rounded-lg rounded-br-none "
        : "rounded-lg rounded-bl-none border ");
    case "journal":
      return base + (isOwn
        ? "rounded-r-2xl rounded-l-md "
        : "rounded-l-2xl rounded-r-md border ");
    case "recipe":
      return base + (isOwn
        ? "rounded-2xl rounded-tr-none "
        : "rounded-2xl rounded-tl-none border ");
    case "sketch":
      return base + (isOwn
        ? "rounded-2xl rounded-br-xl "
        : "rounded-2xl rounded-bl-xl border-2 border-dotted ");
    case "dialogue":
      return base + (isOwn
        ? "rounded-lg "
        : "rounded-lg border-2 ");
    case "ticket":
      return base + (isOwn
        ? "rounded-sm "
        : "rounded-sm border ");
    case "note":
      return base + (isOwn
        ? "rounded-2xl rounded-br-sm rotate-[0.5deg] "
        : "rounded-2xl rounded-bl-sm -rotate-[0.5deg] border ");
    case "card":
      return base + (isOwn
        ? "rounded-xl "
        : "rounded-xl border ");
    case "dream":
      return base + (isOwn
        ? "rounded-3xl rounded-br-lg "
        : "rounded-3xl rounded-bl-lg border ");
    default:
      return base + (isOwn
        ? "rounded-2xl rounded-br-md "
        : "rounded-2xl rounded-bl-md border ");
  }
}

// ─── Sticker Bar Component ───
function StickerBar({ stickers, onSelect, themeColor }: { stickers: string[]; onSelect: (s: string) => void; themeColor: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1.5 bg-white/70 backdrop-blur-sm rounded-full border shadow-sm mx-auto w-fit"
      style={{ borderColor: `${themeColor}20` }}
    >
      {stickers.map((s, i) => (
        <motion.button
          key={i}
          whileHover={{ scale: 1.35, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSelect(s)}
          className="text-lg p-1 hover:bg-white/80 rounded-lg transition-colors"
        >
          {s}
        </motion.button>
      ))}
    </div>
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
  const [showStickers, setShowStickers] = useState(false);
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

    return () => { subscription.unsubscribe(); };
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

  const handleSticker = (sticker: string) => {
    setNewMessage((prev) => prev + sticker + " ");
    setShowStickers(false);
    inputRef.current?.focus();
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Image must be less than 5MB"); return; }

    setUploadingImage(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${community.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("community-chat-images")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      const reader = new FileReader();
      reader.onloadend = () => { setSelectedImage(reader.result as string); setUploadingImage(false); };
      reader.readAsDataURL(file);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("community-chat-images")
      .getPublicUrl(fileName);
    setSelectedImage(urlData.publicUrl);
    setUploadingImage(false);
  };

  const room = ROOMS[theme?.background_pattern || "aesthetic_universe"] || ROOMS.aesthetic_universe;
  const themeColor = theme?.primary_color || community.color;
  const secondaryColor = theme?.secondary_color || "#FFF8F0";

  const formatTime = (dateStr: string) => new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
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
      {/* ═══ BACKGROUND LAYER ═══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0" style={{ backgroundImage: room.pattern, backgroundColor: secondaryColor }} />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 0%, ${themeColor}08 0%, transparent 60%)` }} />
        <AmbientEffect type={room.ambientEffect} />
        {room.floatingElements.map((emoji, i) => (
          <FloatingElement key={i} emoji={emoji} delay={i * 3} duration={15 + i * 3} startX={10 + i * 15} />
        ))}
      </div>

      {/* ═══ HEADER ═══ */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative z-10 flex items-center gap-3 px-4 py-3.5 shadow-lg flex-shrink-0"
        style={{ background: room.headerGradient }}
      >
        <button onClick={onClose} className="p-2.5 rounded-xl transition-all hover:bg-white/20 hover:scale-105 active:scale-95">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <motion.div className="text-3xl" animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}>
          {room.icon}
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-white text-sm truncate" style={{ fontFamily: room.fontFamily }}>{community.name}</h2>
            <Hash className="w-3 h-3 text-white/60" />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-white/80">{messages.length} messages</span>
            </div>
            <span className="text-white/40">|</span>
            <span className="text-xs text-white/70 flex items-center gap-1"><Sparkles className="w-3 h-3" />Live</span>
          </div>
        </div>

        <div className="flex -space-x-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div key={i} className="w-7 h-7 rounded-full border-2 border-white/30 flex items-center justify-center text-xs font-bold text-white"
              style={{ background: `${themeColor}${80 - i * 20}` }}
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.1 }}
            >
              {String.fromCharCode(65 + i)}
            </motion.div>
          ))}
          <div className="w-7 h-7 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-xs text-white">+{Math.floor(Math.random() * 20 + 5)}</div>
        </div>
      </motion.div>

      {/* ═══ MESSAGES ═══ */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
              <Sparkles className="w-10 h-10" style={{ color: themeColor }} />
            </motion.div>
            <p className="text-sm" style={{ color: `${themeColor}99`, fontFamily: room.fontFamily }}>Entering {room.roomVibe}...</p>
          </div>
        ) : messages.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-full text-center px-6"
          >
            {/* Welcome Card */}
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 max-w-sm w-full border shadow-xl overflow-hidden"
              style={{ borderColor: `${themeColor}25` }}
            >
              <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: room.headerGradient }} />
              <motion.div className="text-7xl mb-4" animate={{ y: [0, -8, 0], rotate: [0, 3, -3, 0] }} transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}>
                {room.emoji}
              </motion.div>
              <h3 className="text-xl font-bold mb-3" style={{ color: themeColor, fontFamily: room.fontFamily }}>{room.welcomeTitle}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">{room.welcomeSubtitle}</p>
              <div className="flex items-center justify-center gap-3 text-2xl">
                {room.floatingElements.slice(0, 4).map((emoji, i) => (
                  <motion.span key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}>{emoji}</motion.span>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">Be the first to start the conversation!</p>
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
                const bubbleCls = getBubbleClasses(room.messageBubbleStyle, own);

                return (
                  <div key={msg.id}>
                    {showDateDivider && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center my-4">
                        <div className="px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border shadow-sm">
                          <span className="text-xs font-medium text-gray-500">{formatDate(msg.created_at)}</span>
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
                        {showAvatar ? (
                          <div className="flex flex-col items-center flex-shrink-0 mt-1">
                            <div className="relative">
                              <img src={msg.sender_avatar} alt={msg.sender_name} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" />
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white bg-green-400" />
                            </div>
                          </div>
                        ) : <div className="w-9 flex-shrink-0" />}

                        <div className="flex flex-col">
                          {showAvatar && (
                            <span className={`text-xs font-medium text-gray-400 mb-1 ${own ? "text-right mr-1" : "ml-1"}`}>{msg.sender_name}</span>
                          )}

                          <div className="relative group">
                            <div className={bubbleCls}
                              style={{
                                background: own ? room.ownBubbleGradient : room.bubbleGradient,
                                borderColor: own ? "transparent" : `${themeColor}22`,
                              }}
                            >
                              {msg.media_url && (
                                <div className="mb-2.5 -mx-1">
                                  <motion.img src={msg.media_url} alt="Shared image"
                                    className="rounded-xl max-w-full max-h-56 object-cover cursor-pointer"
                                    onClick={() => { setSelectedImage(msg.media_url); setShowImagePreview(true); }}
                                    whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}
                                  />
                                </div>
                              )}
                              {msg.content && <p className="text-sm leading-relaxed">{msg.content}</p>}
                              <div className={`flex items-center gap-1.5 mt-1.5 ${own ? "justify-end" : "justify-start"}`}>
                                <span className={`text-[10px] ${own ? "text-white/60" : "text-gray-400"}`}>{formatTime(msg.created_at)}</span>
                                {own && <svg className="w-3 h-3 text-white/60" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14A6 6 0 118 2a6 6 0 010 12z" /></svg>}
                              </div>
                            </div>

                            {/* Reaction hint */}
                            <motion.div className={`absolute -bottom-3 ${own ? "left-0" : "right-0"} opacity-0 group-hover:opacity-100 transition-opacity`} initial={false}>
                              <div className="flex gap-1 bg-white rounded-full shadow-md px-1.5 py-0.5 border border-gray-100">
                                {["❤️", "👍", "😂", "🔥"].map((r) => (
                                  <button key={r} className="text-xs hover:scale-125 transition-transform">{r}</button>
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
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ═══ IMAGE PREVIEW BAR ═══ */}
      <AnimatePresence>
        {selectedImage && !showImagePreview && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="relative z-10 px-4 py-2.5 bg-white/90 backdrop-blur-md border-t flex-shrink-0"
            style={{ borderColor: `${themeColor}20` }}
          >
            <div className="max-w-2xl mx-auto flex items-center gap-3">
              <div className="relative">
                <img src={selectedImage} alt="Preview" className="w-14 h-14 rounded-xl object-cover border-2 shadow-sm" style={{ borderColor: `${themeColor}30` }} />
                <button onClick={() => setSelectedImage(null)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors shadow-md">
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
              <span className="text-sm text-gray-500 font-medium">Image ready to send</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ STICKER BAR ═══ */}
      <AnimatePresence>
        {showStickers && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="relative z-10 px-4 py-2 flex-shrink-0"
          >
            <StickerBar stickers={room.stickerSet} onSelect={handleSticker} themeColor={themeColor} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ INPUT AREA ═══ */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
        className="relative z-10 bg-white/95 backdrop-blur-md border-t px-4 py-3.5 flex-shrink-0"
        style={{ borderColor: `${themeColor}15` }}
      >
        <div className="max-w-2xl mx-auto flex items-end gap-2.5">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            className="p-3 rounded-2xl transition-all flex-shrink-0"
            style={{ backgroundColor: `${themeColor}12`, color: themeColor }}
          >
            {uploadingImage ? <Loader2 className="w-5 h-5 animate-spin" /> : <Image className="w-5 h-5" />}
          </motion.button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setShowStickers(!showStickers)}
            className="p-3 rounded-2xl transition-all flex-shrink-0 text-lg"
            style={{ backgroundColor: `${themeColor}12` }}
          >
            <span>{showStickers ? "✕" : "😊"}</span>
          </motion.button>

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
                fontFamily: room.fontFamily,
              }}
              onFocus={(e) => { e.target.style.borderColor = themeColor; e.target.style.boxShadow = `0 0 0 4px ${themeColor}15`; }}
              onBlur={(e) => { e.target.style.borderColor = `${themeColor}25`; e.target.style.boxShadow = "none"; }}
            />
            {newMessage.length > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-300 pointer-events-none">{newMessage.length}</span>
            )}
          </div>

          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            onClick={handleSend}
            disabled={sending || (!newMessage.trim() && !selectedImage)}
            className="p-3.5 rounded-2xl text-white transition-all disabled:opacity-40 disabled:hover:scale-100 flex-shrink-0 shadow-lg"
            style={{ background: room.headerGradient, boxShadow: `0 4px 14px ${themeColor}40` }}
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </motion.button>
        </div>
      </motion.div>

      {/* ═══ FULL IMAGE PREVIEW ═══ */}
      <AnimatePresence>
        {showImagePreview && selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/85 flex items-center justify-center p-4"
            onClick={() => setShowImagePreview(false)}
          >
            <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }} className="relative"
            >
              <img src={selectedImage} alt="Full preview" className="max-w-[90vw] max-h-[85vh] rounded-2xl object-contain shadow-2xl" />
              <button onClick={() => setShowImagePreview(false)} className="absolute -top-3 -right-3 p-2.5 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
