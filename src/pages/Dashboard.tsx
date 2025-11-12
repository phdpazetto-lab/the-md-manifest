import { AppLayout } from "@/components/Layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, Package, TrendingUp } from "lucide-react";

const stats = [
  {
    name: "Receita do Mês",
    value: "R$ 125.840,00",
    change: "+12.5%",
    icon: DollarSign,
    color: "text-primary",
  },
  {
    name: "Despesas",
    value: "R$ 84.320,00",
    change: "-3.2%",
    icon: TrendingUp,
    color: "text-destructive",
  },
  {
    name: "Contratos Ativos",
    value: "24",
    change: "+2",
    icon: FileText,
    color: "text-accent",
  },
  {
    name: "Patrimônio Total",
    value: "R$ 342.500,00",
    change: "+5.1%",
    icon: Package,
    color: "text-success",
  },
];

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema operacional StarMKT</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change} desde o último mês
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Reembolsos Pendentes</CardTitle>
              <CardDescription>Aguardando aprovação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Nenhum reembolso pendente
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contas a Pagar</CardTitle>
              <CardDescription>Vencimentos próximos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma conta a vencer
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;