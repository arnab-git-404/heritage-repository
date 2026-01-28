import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ReactLenis, useLenis } from "lenis/react";
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
