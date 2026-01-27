import { Outlet } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const UserLayout= () => {
  return (
    <div className="min-h-screen">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;