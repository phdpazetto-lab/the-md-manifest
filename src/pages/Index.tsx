import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard, Lock, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <nav className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">StarMKT OS</h1>
              <p className="text-xs text-muted-foreground">Sistema Operacional</p>
            </div>
          </div>
          <Button onClick={() => navigate("/auth")}>
            Acessar Sistema
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Sistema Operacional{" "}
            <span className="text-primary">Administrativo Integrado</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Gerencie finanças, contratos, patrimônio e toda operação administrativa
            da StarMKT em um único lugar, com segurança e eficiência.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")}>
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="p-6 rounded-lg bg-card border border-border">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <LayoutDashboard className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Gestão Completa</h3>
            <p className="text-muted-foreground">
              Financeiro, jurídico, patrimônio e administração em um sistema integrado
            </p>
          </div>

          <div className="p-6 rounded-lg bg-card border border-border">
            <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Seguro e Confiável</h3>
            <p className="text-muted-foreground">
              RLS habilitado, auditoria completa e controle de permissões por perfil
            </p>
          </div>

          <div className="p-6 rounded-lg bg-card border border-border">
            <div className="h-12 w-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Rápido e Eficiente</h3>
            <p className="text-muted-foreground">
              Workflow otimizado para aprovações e dashboards em tempo real
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
