import SubmissionDetail from "@/pages/user/SubmissionDetail";
import Upload from "@/pages/user/Upload";
import { Route, Routes } from "react-router-dom";
import Dashboard from "@/pages/user/Dashboard";
import Profile from "@/pages/user/Profile";
import UserLayout from "@/layouts/UserLayout";
import RequireAuth from "@/components/RequireAuth";
import VersionHistory from "@/pages/user/VersionHistory";
import MySubmissions from "@/pages/user/MySubmissions";
import TestProfile from "@/pages/user/testProfile";


export const UserRoutes = (
  <Route
    path="/user/dashboard"
    element={
      <RequireAuth>
        <UserLayout />
      </RequireAuth>
    }
  >
    <Route index element={<Dashboard />} />
    <Route path="profile" element={<Profile />} />
    <Route path="upload" element={<Upload />} />
    <Route path="submissions" element={<MySubmissions />} />
    <Route path="profile/submissions/:id" element={<SubmissionDetail />} />
    <Route path="tp" element={<TestProfile />} />
    <Route path="profile/submissions/:id/history" element={<VersionHistory/>} />
  </Route>
);
