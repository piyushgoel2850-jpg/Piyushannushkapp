import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Send,
  ChevronLeft,
  MoreVertical,
  Phone,
  Image,
  Mic,
  Check,
  CheckCheck,
} from "lucide-react";

interface ChatPreview {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  type: "text" | "image" | "voice";
}

const SAMPLE_CHATS: ChatPreview[] = [
  {
    id: "1",
    name: "Sarah Reads",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    lastMessage: "Have you read the new Murakami?",
    timestamp: "2m",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Mike Melody",
    avatar: "https://i.pravatar.cc/150?u=mike",
    lastMessage: "That cover was amazing!",
    timestamp: "1h",
    unread: 0,
    online: false,
  },
  {
    id: "3",
    name: "Chef Carla",
    avatar: "https://i.pravatar.cc/150?u=carla",
    lastMessage: "Try adding more garlic next time",
    timestamp: "3h",
    unread: 1,
    online: true,
  },
  {
    id: "4",
    name: "Travel Tom",
    avatar: "https://i.pravatar.cc/150?u=tom",
    lastMessage: "The waterfall hike was incredible!",
    timestamp: "1d",
    unread: 0,
    online: false,
  },
  {
    id: "5",
    name: "Book Club Group",
    avatar: "https://i.pravatar.cc/150?u=bookclub",
    lastMessage: "Next meeting on Saturday at 3pm",
    timestamp: "2d",
    unread: 5,
    online: false,
  },
];

const SAMPLE_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    senderId: "them",
    text: "Hey! I saw you joined the Fiction Lovers community",
    timestamp: "10:30 AM",
    status: "read",
    type: "text",
  },
  {
    id: "2",
    senderId: "me",
    text: "Yes! I'm so excited to find people who love books as much as I do",
    timestamp: "10:32 AM",
    status: "read",
    type: "text",
  },
  {
    id: "3",
    senderId: "them",
    text: "Have you read the new Murakami? I've been meaning to start it",
    timestamp: "10:35 AM",
    status: "read",
    type: "text",
  },
  {
    id: "4",
    senderId: "me",
    text: "Not yet! But it's on my TBR. Want to read it together?",
    timestamp: "10:37 AM",
    status: "delivered",
    type: "text",
  },
];

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(SAMPLE_MESSAGES);

  const chat = selectedChat
    ? SAMPLE_CHATS.find((c) => c.id === selectedChat)
    : null;

  const filteredChats = SAMPLE_CHATS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (!messageText.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: "me",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
      type: "text",
    };
    setMessages([...messages, newMessage]);
    setMessageText("");
  };

  if (selectedChat && chat) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
        {/* Chat Header */}
        <div className="sticky top-0 z-30 bg-[#FFF8F0]/95 backdrop-blur-md border-b border-gray-100 px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <button
              onClick={() => setSelectedChat(null)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="relative">
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              {chat.online && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-800 text-sm">{chat.name}</h2>
              <p className="text-xs text-gray-500">
                {chat.online ? "Online" : "Offline"}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Phone className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.senderId === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                    msg.senderId === "me"
                      ? "bg-pastel-pink text-white rounded-br-md"
                      : "bg-white text-gray-800 rounded-bl-md border border-gray-100"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <div
                    className={`flex items-center gap-1 mt-1 ${
                      msg.senderId === "me" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span
                      className={`text-xs ${
                        msg.senderId === "me" ? "text-white/70" : "text-gray-400"
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                    {msg.senderId === "me" && (
                      <span className="text-white/70">
                        {msg.status === "read" ? (
                          <CheckCheck className="w-3 h-3" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Image className="w-5 h-5 text-gray-500" />
            </button>
            <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Mic className="w-5 h-5 text-gray-500" />
            </button>
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pastel-pink focus:ring-2 focus:ring-pastel-pink/20 outline-none transition-all bg-gray-50"
            />
            <button
              onClick={handleSend}
              className="p-2.5 rounded-xl bg-pastel-pink text-white hover:bg-pastel-pink/90 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
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
          <h1 className="text-xl font-bold text-gray-800 mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-pastel-pink focus:ring-2 focus:ring-pastel-pink/20 outline-none transition-all bg-white"
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="space-y-2">
          {filteredChats.map((chat, index) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedChat(chat.id)}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white transition-all cursor-pointer"
            >
              <div className="relative">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {chat.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#FFF8F0]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-gray-800 truncate">
                    {chat.name}
                  </h3>
                  <span className="text-xs text-gray-400">{chat.timestamp}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-sm text-gray-500 truncate pr-4">
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <span className="bg-pastel-pink text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
