import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SimProvider } from "./contexts/SimContext";
import Home from "./pages/Home";
import Briefing from "./pages/Briefing";
import Simulator from "./pages/Simulator";
import Results from "./pages/Results";
import Story from "./pages/Story";
import Transparency from "./pages/Transparency";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/briefing"} component={Briefing} />
      <Route path={"/simulator"} component={Simulator} />
      <Route path={"/results"} component={Results} />
      <Route path={"/story"} component={Story} />
      <Route path={"/transparency"} component={Transparency} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <SimProvider>
            <Router />
          </SimProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
