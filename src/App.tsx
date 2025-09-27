import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import WebApp from "./pages/WebApp";
import FreeTools from "./pages/FreeTools";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";
import LifetimeValueApp from "./pages/ltv";
import AcosTargetCalculator from "./pages/acosCalculator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Analytics />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/free-tools" element={<FreeTools />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/tools/roi-calculator" element={<WebApp />} />
          <Route path="/tools/lifetime-value" element={<LifetimeValueApp />} />
          <Route path="/tools/acos-calculator" element={<AcosTargetCalculator />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
