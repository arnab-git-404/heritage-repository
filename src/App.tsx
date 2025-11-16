import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navigation from "./components/Navigation";
import Landing from "./pages/Landing";
import Explore from "./pages/Explore";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import RequireAdmin from "./components/RequireAdmin";
import Category from "./pages/Category";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Chat from "./pages/Chat";
import Collaboration from "./pages/Collaboration";
// import ChatWidget from "./components/ChatWidget";
import ProtectedRoute from "./components/ProtectedRoute";
import { ReactLenis, useLenis } from "lenis/react";
import Contact from "./pages/Contact";
import AdminTest from "./pages/AdminTest";
import AmendmentRequests from "./pages/AmendmentRequest";
import AmendmentDetail from "./pages/AmendmentDetail";
import SubmissionDetail from "./pages/SubmissionDetail";
import Footer from "./components/Footer";


const queryClient = new QueryClient();

// Layout component for routes with navigation
const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navigation />
    {children}
  </>
);

const App = () => (
  <>
    <ReactLenis root />
    <Toaster />
    <Sonner />
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/admin" element={<Admin />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/amendments" element={<AmendmentRequests />} />
          <Route path="/amendments/:id" element={<AmendmentDetail />} />
          <Route
            path="/profile/submissions/:id"
            element={<SubmissionDetail />}
            />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/upload" element={<Upload />} />
            {/* <Route path="/chat/:otherUserId" element={<Layout><Chat /></Layout>} /> */}
            {/* <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} /> */}
            {/* <Route path="/collaboration" element={<Layout><Collaboration /></Layout>} /> */}
            {/* <Route path="/category/:categoryName" element={<Layout><Category /></Layout>} /> */}
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  </>
);

export default App;
