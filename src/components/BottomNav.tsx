import { Link, useLocation } from "react-router-dom";
import {
  Compass,
  Users,
  Award,
  Calendar,
  MessageCircle,
  User,
} from "lucide-react";

const navItems = [
  { path: "/app", label: "Explore", icon: Compass },
  { path: "/app/communities", label: "Communities", icon: Users },
  { path: "/app/quests", label: "Quests", icon: Award },
  { path: "/app/events", label: "Events", icon: Calendar },
  { path: "/app/chat", label: "Messages", icon: MessageCircle },
  { path: "/app/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100">
      <div className="max-w-lg mx-auto px-2 py-1">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
