import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Templates from "./pages/Templates";
import MyDiagrams from "./pages/MyDiagrams";
import NotFound from "./pages/NotFound";

// React Bits BlobCursor - placeholder until installed
const BlobCursor = ({ color, size, blur, ease }: any) => null;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AppContent = () => {
  const isMobile = useIsMobile();
  
  return (
    <>
      {/* BlobCursor - Desktop Only */}
      {!isMobile && (
        <BlobCursor 
          color="rgba(59, 130, 246, 0.4)" 
          size={60} 
          blur={40} 
          ease={0.15} 
        />
      )}
      
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/editor" element={<Index />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/my-diagrams" element={<MyDiagrams />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
