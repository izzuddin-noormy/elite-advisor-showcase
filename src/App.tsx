import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { trackPageview } from "@/lib/analytics";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import InsightDetail from "./pages/InsightDetail";
import InsightsList from "./pages/InsightsList";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPages from "./pages/AdminPages";
import AdminPageEditor from "./pages/AdminPageEditor";
import AdminProperties from "./pages/AdminProperties";
import AdminPropertyEditor from "./pages/AdminPropertyEditor";
import AdminInsights from "./pages/AdminInsights";
import AdminInsightEditor from "./pages/AdminInsightEditor";
import AdminSiteContent from "./pages/AdminSiteContent";
import AdminMedia from "./pages/AdminMedia";
import AdminMessages from "./pages/AdminMessages";
import AdminSettings from "./pages/AdminSettings";
import NewLaunch from "./pages/NewLaunch";
import NewLaunchDetail from "./pages/NewLaunchDetail";
import AdminDevelopments from "./pages/AdminDevelopments";
import AdminDevelopmentEditor from "./pages/AdminDevelopmentEditor";

const queryClient = new QueryClient();

// Sends a PostHog pageview on every client-side route change
const PageviewTracker = () => {
  const location = useLocation();
  useEffect(() => {
    trackPageview(location.pathname + location.search);
  }, [location.pathname, location.search]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PageviewTracker />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/projects/:id" element={<PropertyDetail />} />
            <Route path="/insights" element={<InsightsList />} />
            <Route path="/insights/:id" element={<InsightDetail />} />
            <Route path="/new-launch" element={<NewLaunch />} />
            <Route path="/new-launch/:slug" element={<NewLaunchDetail />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />}>
              <Route index element={<AdminDashboard />} />
              <Route path="pages" element={<AdminPages />} />
              <Route path="pages/new" element={<AdminPageEditor />} />
              <Route path="pages/:id" element={<AdminPageEditor />} />
              <Route path="properties" element={<AdminProperties />} />
              <Route path="properties/new" element={<AdminPropertyEditor />} />
              <Route path="properties/:id" element={<AdminPropertyEditor />} />
              <Route path="insights" element={<AdminInsights />} />
              <Route path="insights/new" element={<AdminInsightEditor />} />
              <Route path="insights/:id" element={<AdminInsightEditor />} />
              <Route path="developments" element={<AdminDevelopments />} />
              <Route path="developments/new" element={<AdminDevelopmentEditor />} />
              <Route path="developments/:id" element={<AdminDevelopmentEditor />} />
              <Route path="content" element={<AdminSiteContent />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
