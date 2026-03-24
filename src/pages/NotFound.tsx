// import { useLocation } from "react-router-dom";
// import { useEffect } from "react";
// import Navigation from "@/components/Navigation";
// import Footer from "@/components/Footer";

// const NotFound = () => {
//   const location = useLocation();

//   useEffect(() => {
//     console.error("404 Error: User attempted to access non-existent route:", location.pathname);
//   }, [location.pathname]);

//   return (
//     <div className="min-h-screen flex flex-col">
//       <div className="flex-1 flex items-center justify-center bg-background">
//         <div className="text-center">
//           <h1 className="mb-4 text-4xl font-bold text-primary">404</h1>
//           <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
//           <a href="/" className="text-primary underline hover:text-primary/80">
//             Return to Home
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NotFound;



import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";


const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const content = (
    <div className="flex-1 flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
        <p className="mb-2 text-xl text-muted-foreground">
          Page not found
        </p>
        <p className="mb-6 text-sm text-muted-foreground">
          The page you’re looking for doesn’t exist or was moved.
        </p>

        <div className="flex gap-3 justify-center">
          <Button asChild>
            <Link to={isAdminRoute ? "/admin" : "/"}>
              Go to {isAdminRoute ? "Admin Dashboard" : "Home"}
            </Link>
          </Button>

          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );

  // Admin 404 → NO public navigation/footer
  if (isAdminRoute) {
    return <div className="min-h-screen flex flex-col">{content}</div>;
  }

  // Public 404 → with Navigation & Footer
  return (
    <div className="min-h-screen flex flex-col">

      {content}
      </div>
  );
};

export default NotFound;
