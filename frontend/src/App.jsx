import React from "react";
import { Switch, Route } from "wouter";
import Landing from "./pages/Landing.jsx";
import AuditForm from "./pages/AuditForm.jsx";
import AuditResults from "./pages/AuditResults.jsx";
import SharedAudit from "./pages/SharedAudit.jsx";

function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-black text-foreground mb-2">404</h1>
        <p className="text-muted-fg mb-4">Page not found</p>
        <a href="/" className="text-primary underline">Go home</a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/audit" component={AuditForm} />
      <Route path="/results" component={AuditResults} />
      <Route path="/audit/:id" component={SharedAudit} />
      <Route component={NotFound} />
    </Switch>
  );
}
