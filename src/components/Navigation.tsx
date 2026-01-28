// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { cn } from "@/lib/utils";
// import { useAuth } from "@/context/AuthContext";

// const Navigation = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { isAuthenticated, logout, user } = useAuth();
  
//   // Debug log
//   console.log('Navigation - Auth State:', { isAuthenticated, user });

//   // Add a debug effect to verify the auth state
//   useEffect(() => {
//     console.log('Auth state changed:', { isAuthenticated, user });
//   }, [isAuthenticated, user]);

  

//   const navItems = [
//     { name: "Home", path: "/" },
//     { name: "Explore", path: "/explore" },
//     { name: "About Us", path: "/about-us" },
//     { name: "Upload", path: "/upload" },
//   ];

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//     // Force a full page reload to ensure all state is cleared
//     window.location.reload();
//   };

//   return (
//     <nav className="sticky top-0 z-50 bg-primary text-primary-foreground backdrop-blur-sm shadow-sm">
//       <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4">
//         <div className="flex items-center justify-between">
//           <Link to="/" className="flex items-center space-x-2">
//             <h1 className="text-xl md:text-2xl font-heading font-bold text-primary-foreground">
//               Heritage Repository
//             </h1>
//           </Link>
          
//           <div className="hidden md:flex items-center space-x-8">
//             {navItems.map((item) => (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className={cn(
//                   "nav-link text-sm font-medium transition-colors",
//                   location.pathname === item.path
//                     ? "text-primary-foreground"
//                     : "text-primary-foreground/80 hover:text-primary-foreground"
//                 )}
//               >
//                 {item.name}
//               </Link>
//             ))}
//             {isAuthenticated && (
//               <Link
//                 to="/profile"
//                 className={cn(
//                   "nav-link text-sm font-medium transition-colors",
//                   location.pathname === '/profile'
//                     ? "text-primary-foreground"
//                     : "text-primary-foreground/80 hover:text-primary-foreground"
//                 )}
//               >
//                 Profile
//               </Link>
//             )}
//             {!isAuthenticated ? (
//               <Link
//                 to="/signup"
//                 className={cn(
//                   "nav-link text-sm font-medium transition-colors",
//                   location.pathname === '/signup'
//                     ? "text-primary-foreground"
//                     : "text-primary-foreground/80 hover:text-primary-foreground"
//                 )}
//               >
//                 Sign Up
//               </Link>
//             ) : null}
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <div className="flex flex-col space-y-1">
//               {navItems.map((item) => (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   className={cn(
//                     "text-xs font-medium px-2 py-1",
//                     location.pathname === item.path
//                       ? "text-primary-foreground"
//                       : "text-primary-foreground/80"
//                   )}
//                 >
//                   {item.name}
//                 </Link>
//               ))}
//               {isAuthenticated && (
//                 <Link
//                   to="/profile"
//                   className={cn(
//                     "text-xs font-medium px-2 py-1",
//                     location.pathname === '/profile'
//                       ? "text-primary-foreground"
//                       : "text-primary-foreground/80"
//                   )}
//                 >
//                   Profile
//                 </Link>
//               )}
//               {!isAuthenticated ? (
//                 <Link
//                   to="/signup"
//                   className={cn(
//                     "text-xs font-medium px-2 py-1",
//                     location.pathname === '/signup'
//                       ? "text-primary-foreground"
//                       : "text-primary-foreground/80"
//                   )}
//                 >
//                   Sign Up
//                 </Link>
//               ) : null}
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navigation;





import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Moon, Sun, Menu, User, LogOut, Upload, Home, Compass, Info, UserPlus , LogIn, Mail } from "lucide-react";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Explore", path: "/explore", icon: Compass },
    { name: "About Us", path: "/about-us", icon: Info },
    { name: "Upload", path: "/user/dashboard/upload", icon: Upload },
    { name: "Contact", path: "/contact", icon: Mail }
  ];

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const handleNavClick = (path: string) => {
    setMobileOpen(false);
    navigate(path);
  };



  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* <div className=" mx-auto px-4 sm:px-6 lg:px-8"> */}
      <div className=" container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            {/* <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              HR
            </div> */}
            <h1 className="text-lg md:text-xl font-heading font-bold text-foreground">
              Heritage<br /> Repository
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
                className="text-sm font-medium"
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </Button>
            ))}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
           <AnimatedThemeToggler />

            {/* User Menu or Sign Up */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/user/dashboard')}>
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/user/dashboard/upload')}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Content
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate('/login')}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Mobile Theme Toggle */}
           <AnimatedThemeToggler />

            {/* Mobile Menu Trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-8">
                  {/* User Info (if authenticated) */}
                  {isAuthenticated && user && (
                    <div className="flex items-center space-x-3 p-4 border-2 rounded-xl">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Links */}
                  <div className="space-y-1">
                    {navItems.map((item) => (
                      <Button
                        key={item.path}
                        variant={location.pathname === item.path ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleNavClick(item.path)}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.name}
                      </Button>
                    ))}
                  </div>

                  {/* Auth Actions */}
                  <div className="pt-4 border-t space-y-2">
                    {isAuthenticated ? (
                      <>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => handleNavClick('/user/dashboard')}
                        >
                          <User className="h-4 w-4 mr-3" />
                          Dashboard
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-destructive hover:text-destructive"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="default"
                        className="w-full"
                        onClick={() => handleNavClick('/signup')}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Sign Up
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;