import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const Landing = lazy(() => import("./pages/Landing"));
const AuditForm = lazy(() => import("./pages/AuditForm"));
const AuditResults = lazy(() => import("./pages/AuditResults"));
const SharedAudit = lazy(() => import("./pages/SharedAudit"));
const NotFound = lazy(() => import("./pages/not-found"));

const queryClient = new QueryClient();

function Router() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
        </div>
      }
    >
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/audit" component={AuditForm} />
        <Route path="/results/:id" component={AuditResults} />
        <Route path="/results" component={AuditResults} />
        <Route path="/audit/:id" component={SharedAudit} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
