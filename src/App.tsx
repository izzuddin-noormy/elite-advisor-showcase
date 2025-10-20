import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import InsightDetail from "./pages/InsightDetail";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/projects/:id" element={<PropertyDetail />} />
            <Route path="/insights/:id" element={<InsightDetail />} />
            
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
