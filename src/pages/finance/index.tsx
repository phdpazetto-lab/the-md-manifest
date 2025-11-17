import { FinanceShell } from "@/components/finance/layout/FinanceShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const modules = [
  { title: "Contas a Pagar", description: "Controle de faturas, boletos e notas fiscais.", to: "/finance/contas-a-pagar" },
  { title: "Pagamentos", description: "Histórico de pagamentos e comprovantes.", to: "/finance/pagamentos" },
  { title: "Reembolsos", description: "Solicitações e aprovações com status controlado.", to: "/finance/reembolsos" },
  { title: "Adiantamentos", description: "Adiantamentos com documentos de respaldo.", to: "/finance/adiantamentos" },
  { title: "Notas Fiscais", description: "Envio seguro de NF pelos prestadores.", to: "/finance/notas-fiscais" },
];

const FinanceDashboard = () => {
  return (
    <FinanceShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Centro de Controle Financeiro</h2>
            <p className="text-muted-foreground">Gestão unificada com Supabase, RBAC e RLS.</p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2 text-xs uppercase">
            <ShieldCheck className="h-4 w-4" /> Políticas ativas
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module) => (
            <Card key={module.to} className="h-full">
              <CardHeader>
                <CardTitle>{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="secondary" className="w-full">
                  <Link to={module.to}>Acessar</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </FinanceShell>
  );
};

export default FinanceDashboard;
