import { Routes, Route } from "react-router-dom";
import { AdminRoutes } from "@/routes/AdminRoutes";
import { PublicRoutes } from "@/routes/PublicRoutes";
import { UserRoutes } from "@/routes/UserRoutes";
import NotFound from "@/pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      {PublicRoutes}
      {UserRoutes}
      {AdminRoutes}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
