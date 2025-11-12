import { AppLayout } from "@/components/Layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Patrimonio = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Patrimônio</h1>
            <p className="text-muted-foreground">Controle de ativos e movimentações</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Ativo
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Ativos Totais</CardTitle>
              <CardDescription>Total de bens cadastrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">0</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Valor Total</CardTitle>
              <CardDescription>Valor do patrimônio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-success">R$ 0,00</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Em Manutenção</CardTitle>
              <CardDescription>Ativos em manutenção</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-warning">0</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ativos</CardTitle>
            <CardDescription>Lista de todos os bens patrimoniais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              Nenhum ativo cadastrado
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Patrimonio;