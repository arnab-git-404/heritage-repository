import PublicLayout from "@/layouts/PublicLayout";
import AdminLogin from "@/pages/admin/AdminLogin";
import About from "@/pages/public/About";
import Contact from "@/pages/public/Contact";
import Explore from "@/pages/public/Explore";
import ForgotPassword from "@/pages/public/ForgotPassword";
import Landing from "@/pages/public/Landing";
import Login from "@/pages/public/Login";
import SignUp from "@/pages/public/SignUp";
import ResetPassword from "@/pages/public/ResetPassword";
import React from "react";
import { Route, Routes } from "react-router-dom";

export const PublicRoutes = (
  <Route path="/" element={<PublicLayout />}>
    <Route index element={<Landing />} />
    <Route path="explore" element={<Explore />} />
    <Route path="about-us" element={<About />} />
    <Route path="contact" element={<Contact />} />
    <Route path="login" element={<Login />} />
    <Route path="signup" element={<SignUp />} />
    <Route path="forgot-password" element={<ForgotPassword />} />
    <Route path="reset-password" element={<ResetPassword />} />
  </Route>
);
