import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SimProvider } from "./contexts/SimContext";
import Home from "./pages/Home";
import Briefing from "./pages/Briefing";
import Prologue from "./pages/Prologue";
import Simulator from "./pages/Simulator";
import Results from "./pages/Results";
import Story from "./pages/Story";
import Transparency from "./pages/Transparency";
import Faq from "./pages/Faq";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import HeroEdit from "./pages/HeroEdit";
import ScrollProgress from "./components/ScrollProgress";
import SkipToContent from "./components/SkipToContent";
import CookieBanner from "./components/CookieBanner";

import { initUtm } from "./lib/utm";

/**
 * On route change: scroll to the top, unless the URL carries a hash
 * (e.g. /faq#targets) — then bring that anchor into view after the
 * new page has mounted.
 */
function ScrollRestoration() {
  const [location] = useLocation();
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash) {
      // Two frames: one for the router, one for the page's own content.
      const scroll = () => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ block: "start" });
          return true;
        }
        requestAnimationFrame(scroll);
        return false;
      };
      let attempts = 0;
      const tryScroll = () => {
        attempts += 1;
        if (!scroll() && attempts < 5) requestAnimationFrame(tryScroll);
      };
      requestAnimationFrame(tryScroll);
      return;
    }
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
  const reducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
        transition={{
          duration: reducedMotion ? 0 : 0.28,
          ease: [0.23, 1, 0.32, 1],
        }}
      >
        <Switch location={location}>
          <Route path={"/"} component={Home} />
          <Route path={"/briefing"} component={Briefing} />
          <Route path={"/prologue"} component={Prologue} />
          <Route path={"/simulator"} component={Simulator} />
          <Route path={"/results"} component={Results} />
          <Route path={"/story"} component={Story} />
          <Route path={"/transparency"} component={Transparency} />
          <Route path={"/faq"} component={Faq} />
          <Route path={"/privacy"} component={Privacy} />
          <Route path={"/terms"} component={Terms} />
          <Route path={"/__hero-edit"} component={HeroEdit} />
          {/* Final fallback route */}
          <Route component={NotFound} />
        </Switch>
      </motion.div>
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
            <Router />
            <CookieBanner />
          </SimProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
