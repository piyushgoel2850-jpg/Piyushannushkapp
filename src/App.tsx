import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import ExplorePage from "./pages/ExplorePage";
import CommunitiesPage from "./pages/CommunitiesPage";
import QuestsPage from "./pages/QuestsPage";
import EventsPage from "./pages/EventsPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import BottomNav from "./components/BottomNav";
import { CommunityProvider } from "./context/CommunityContext";
import CommunityChat from "./components/CommunityChat";
import { useCommunity } from "./context/CommunityContext";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <CommunityProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </CommunityProvider>
  );
}

function AppLayoutInner({ children }: { children: React.ReactNode }) {
  const { selectedCommunity, showChat, closeChat } = useCommunity();

  return (
    <>
      {children}
      {selectedCommunity && showChat && (
        <CommunityChat community={selectedCommunity} onClose={closeChat} />
      )}
      <BottomNav />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route
          path="/app"
          element={
            <AppLayout>
              <ExplorePage />
            </AppLayout>
          }
        />
        <Route
          path="/app/communities"
          element={
            <AppLayout>
              <CommunitiesPage />
            </AppLayout>
          }
        />
        <Route
          path="/app/quests"
          element={
            <AppLayout>
              <QuestsPage />
            </AppLayout>
          }
        />
        <Route
          path="/app/events"
          element={
            <AppLayout>
              <EventsPage />
            </AppLayout>
          }
        />
        <Route
          path="/app/chat"
          element={
            <AppLayout>
              <ChatPage />
            </AppLayout>
          }
        />
        <Route
          path="/app/profile"
          element={
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          }
        />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
