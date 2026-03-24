import AmendmentRequests from "@/pages/admin/AmendmentRequest";
import ApprovedContent from "@/pages/admin/ApprovedContent";
import AmendmentDetail from "@/pages/admin/AmendmentDetail";
import RejectedContent from "@/pages/admin/RejectedContent";
import PendingContent from "@/pages/admin/PendingContent";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import RequireAdmin from "@/components/RequireAdmin";
import { Route } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import Users from "@/pages/admin/Users";
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/admin/AdminLogin";
import Settings from "@/pages/admin/Settings";

export const AdminRoutes = (
  <>
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route
      path="/admin"
      element={
        <RequireAdmin>
          <AdminLayout />
        </RequireAdmin>
      }
    >
      <Route index element={<AdminDashboard />} />
      <Route path="users" element={<Users />} />
      <Route path="approved" element={<ApprovedContent />} />
      <Route path="pending" element={<PendingContent />} />
      <Route path="rejected" element={<RejectedContent />} />
      <Route path="amendments" element={<AmendmentRequests />} />
      <Route path="amendments/:id" element={<AmendmentDetail />} />
      <Route path="test" element={<Admin />} />
      <Route path="settings" element={<Settings />} />
    </Route>
  </>
);
