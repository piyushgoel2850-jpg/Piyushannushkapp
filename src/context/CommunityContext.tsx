import { createContext, useContext, useState, useCallback } from "react";
import type { Community } from "../types";

interface CommunityContextType {
  selectedCommunity: Community | null;
  showChat: boolean;
  selectCommunity: (community: Community) => void;
  openChat: (community: Community) => void;
  closeChat: () => void;
  clearCommunity: () => void;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [showChat, setShowChat] = useState(false);

  const selectCommunity = useCallback((community: Community) => {
    setSelectedCommunity(community);
    setShowChat(false);
  }, []);

  const openChat = useCallback((community: Community) => {
    setSelectedCommunity(community);
    setShowChat(true);
  }, []);

  const closeChat = useCallback(() => {
    setShowChat(false);
  }, []);

  const clearCommunity = useCallback(() => {
    setSelectedCommunity(null);
    setShowChat(false);
  }, []);

  return (
    <CommunityContext.Provider
      value={{
        selectedCommunity,
        showChat,
        selectCommunity,
        openChat,
        closeChat,
        clearCommunity,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error("useCommunity must be used within a CommunityProvider");
  }
  return context;
}
