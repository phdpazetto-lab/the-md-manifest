import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Financeiro from "./pages/Financeiro";
import Juridico from "./pages/Juridico";
import Patrimonio from "./pages/Patrimonio";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import FinanceDashboard from "./pages/finance";
import ContasAPagarPage from "./pages/finance/contas-a-pagar";
import PagamentosPage from "./pages/finance/pagamentos";
import ReembolsosPage from "./pages/finance/reembolsos";
import AdiantamentosPage from "./pages/finance/adiantamentos";
import NfPrestadoresPage from "./pages/finance/nf-prestadores";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/finance" element={<FinanceDashboard />} />
          <Route path="/finance/contas-a-pagar" element={<ContasAPagarPage />} />
          <Route path="/finance/pagamentos" element={<PagamentosPage />} />
          <Route path="/finance/reembolsos" element={<ReembolsosPage />} />
          <Route path="/finance/adiantamentos" element={<AdiantamentosPage />} />
          <Route path="/finance/notas-fiscais" element={<NfPrestadoresPage />} />
          <Route path="/juridico" element={<Juridico />} />
          <Route path="/patrimonio" element={<Patrimonio />} />
          <Route path="/admin" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
