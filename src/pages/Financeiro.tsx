import { AppLayout } from "@/components/Layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Financeiro = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
            <p className="text-muted-foreground">O novo módulo completo está em /finance.</p>
          </div>
          <Button asChild>
            <a href="/finance" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Acessar módulo
            </a>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Redirecionamento</CardTitle>
            <CardDescription>Use o módulo dedicado para experiência completa com Supabase.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Todas as funcionalidades financeiras agora estão centralizadas em <strong>/finance</strong> com RBAC, RLS e uploads
              seguros. Use o botão acima para navegar.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Financeiro;