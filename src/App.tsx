import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navigation from "./components/Navigation";
import Landing from "./pages/public/Landing";
import Explore from "./pages/public/Explore";
import Upload from "./pages/user/Upload";
import Login from "./pages/public/Login";
import SignUp from "./pages/public/SignUp";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/admin/AdminLogin";
import RequireAdmin from "./components/RequireAdmin";
import Category from "./pages/Category";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/public/ForgotPassword";
import ResetPassword from "./pages/public/ResetPassword";
import Profile from "./pages/user/Dashboard";
import About from "./pages/public/About";
import Chat from "./pages/Chat";
import Collaboration from "./pages/Collaboration";
// import ChatWidget from "./components/ChatWidget";
import ProtectedRoute from "./components/ProtectedRoute";
import { ReactLenis, useLenis } from "lenis/react";
import Contact from "./pages/public/Contact";
import AmendmentRequests from "./pages/admin/AmendmentRequest";
import AmendmentDetail from "./pages/admin/AmendmentDetail";
import SubmissionDetail from "./pages/SubmissionDetail";
import Footer from "./components/Footer";

import AppRoutes from "./routes/AppRoutes";

const App = () => (
  <>
    <ReactLenis root />
    <Toaster />
    <Sonner />
    <AppRoutes />
  </>
);

export default App;
