import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Contacts from "./pages/Contacts";
import Pipeline from "./pages/Pipeline";
import Leads from "./pages/Leads";
import Reports from "./pages/Reports";
import Admin from "./pages/Admin";
import Marketing from "@/pages/Marketing";
import Automation from "@/pages/Automation";
import Notes from "@/pages/Notes";
import OpportunityDetails from "@/pages/OpportunityDetails";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2, AlertTriangle } from "lucide-react";

function Router() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/auth" component={Auth} />
        <Route component={Home} />
      </Switch>
    );
  }

  // Authenticated routes with layout
  return (
    <Layout>
      <Switch>
        <Route path={"/dashboard"} component={Dashboard} />
        <Route path={"/contacts"} component={Contacts} />
        <Route path={"/pipeline"} component={Pipeline} />
        <Route path={"/pipeline/:id"} component={OpportunityDetails} />
        <Route path={"/marketing"} component={Marketing} />
        <Route path={"/support"} component={() => <div>Atendimento - Em desenvolvimento</div>} />
        <Route path={"/reports"} component={Reports} />
        <Route path={"/leads"} component={Leads} />
        <Route path={"/automation"} component={Automation} />
        <Route path={"/notes"} component={Notes} />
        <Route path={"/admin"} component={Admin} />
        <Route path={"/404"} component={NotFound} />
        <Route path={"/auth-error"} component={() => (
          <div className="flex flex-col items-center justify-center h-screen gap-4 text-center px-6">
            <AlertTriangle className="w-12 h-12 text-amber-500" />
            <h1 className="text-2xl font-bold text-gray-900">Configuração OAuth ausente</h1>
            <p className="text-gray-600 max-w-md">
              As variáveis <code className="bg-gray-100 px-1 rounded">VITE_OAUTH_PORTAL_URL</code> e{" "}
              <code className="bg-gray-100 px-1 rounded">VITE_APP_ID</code> não estão configuradas no Vercel.
              Acesse <strong>Settings → Environment Variables</strong> para adicionar.
            </p>
          </div>
        )} />
        {/* Redirect root to dashboard */}
        <Route path={"/"} component={() => <Dashboard />} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
