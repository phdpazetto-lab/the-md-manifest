import { AppLayout } from "@/components/Layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Juridico = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Jurídico</h1>
            <p className="text-muted-foreground">Gestão de contratos e documentação legal</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Contrato
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Contratos Ativos</CardTitle>
              <CardDescription>24 contratos vigentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">24</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>A Vencer em 30 dias</CardTitle>
              <CardDescription>Contratos próximos ao vencimento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-warning">3</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contratos</CardTitle>
            <CardDescription>Gestão completa de contratos e documentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              Nenhum contrato cadastrado
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Juridico;