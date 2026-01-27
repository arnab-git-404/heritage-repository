import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  BarChart3,
  FileText,
  CheckCircle2,
  XCircle,
  Users,
  Menu,
  LogOut,
  RefreshCw,
  Bell,
  Settings,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"


interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("auth_token");
    if (!token) {
      navigate("/admin/login", { replace: true });
    } else {
      fetchStats();
    }
  }, [navigate]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("auth_token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/stats`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("auth_token");
    toast({ title: "Logged out", description: "Successfully logged out" });
    navigate("/admin/login", { replace: true });
  };

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: BarChart3,
      badge: null,
    },
    {
      title: "Pending",
      href: "/admin/pending",
      icon: FileText,
      badge: stats?.pendingSubmissions || null,
      badgeVariant: "secondary" as const,
    },
    {
      title: "Approved",
      href: "/admin/approved",
      icon: CheckCircle2,
      badge: null,
    },
    {
      title: "Rejected",
      href: "/admin/rejected",
      icon: XCircle,
      badge: null,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
      badge: null,
    },
    {
      title: "Amendments",
      href: "/admin/amendments",
      icon: FileText,
      badge: stats?.amendmentRequests || null,
      badgeVariant: "secondary" as const,
    }

  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 flex justify-between items-center">

        <h2 className="text-2xl font-heading font-bold text-primary">
          Admin Panel
        </h2>
        {/* <p className="text-sm text-muted-foreground mt-1">
          Heritage Repository
        </p> */}

        <AnimatedThemeToggler />

      </div>

      <Separator />

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:bg-accent ${
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="flex-1">{item.title}</span>
                {item.badge !== null && item.badge > 0 && (
                  <Badge variant={item.badgeVariant || "default"} className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />

      <div className="p-4 space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => navigate("/admin/settings")}
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <SidebarContent />
            </SheetContent>
          </Sheet>

          <h1 className="text-lg font-heading font-bold text-primary">
            Admin Dashboard
          </h1>

          <Button variant="ghost" size="icon" onClick={fetchStats}>
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 border-r bg-card h-screen sticky top-0">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Desktop Header */}
          {/* <header className="hidden lg:block border-b bg-card sticky top-0 z-40 shadow-sm">
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-heading font-bold text-primary">
                  {navItems.find((item) => item.href === location.pathname)?.title || "Dashboard"}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage submissions and users
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" onClick={fetchStats}>
                  <RefreshCw className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header> */}

          {/* Page Content */}
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;