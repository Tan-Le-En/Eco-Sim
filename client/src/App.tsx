import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SimProvider } from "./contexts/SimContext";
import Home from "./pages/Home";
import Briefing from "./pages/Briefing";
import Simulator from "./pages/Simulator";
import Results from "./pages/Results";
import Story from "./pages/Story";
import Transparency from "./pages/Transparency";
import Faq from "./pages/Faq";
import ScrollProgress from "./components/ScrollProgress";
import SkipToContent from "./components/SkipToContent";
import CookieBanner from "./components/CookieBanner";
import FloatingContact from "./components/FloatingContact";
import { initUtm } from "./lib/utm";

function PageEntrance({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ScrollRestoration() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location]);
  return null;
}

function Boot() {
  // One-time attribution record
  useEffect(() => {
    initUtm();
  }, []);
  return null;
}

function Router() {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Switch key={location} location={location}>
        <Route path={"/"} component={Home} />
        <Route path={"/briefing"} component={Briefing} />
        <Route path={"/simulator"} component={Simulator} />
        <Route path={"/results"} component={Results} />
        <Route path={"/story"} component={Story} />
        <Route path={"/transparency"} component={Transparency} />
        <Route path={"/faq"} component={Faq} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across pages
// - Theme is switchable (light = paper field study, dark = night archive)

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <SimProvider>
            <ScrollRestoration />
            <Boot />
            <SkipToContent />
            <ScrollProgress />
            <PageEntrance>
              <Router />
            </PageEntrance>
            <CookieBanner />
            <FloatingContact />
          </SimProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
