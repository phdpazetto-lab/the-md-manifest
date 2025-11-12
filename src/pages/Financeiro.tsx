import { AppLayout } from "@/components/Layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
            <p className="text-muted-foreground">Gestão financeira completa</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Lançamento
          </Button>
        </div>

        <Tabs defaultValue="invoices" className="space-y-4">
          <TabsList>
            <TabsTrigger value="invoices">Contas a Pagar</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="reimbursements">Reembolsos</TabsTrigger>
            <TabsTrigger value="advances">Adiantamentos</TabsTrigger>
            <TabsTrigger value="providers">Prestadores</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contas a Pagar</CardTitle>
                <CardDescription>Gerencie todas as faturas e contas pendentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Nenhuma conta cadastrada
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pagamentos</CardTitle>
                <CardDescription>Histórico de pagamentos realizados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Nenhum pagamento registrado
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reimbursements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reembolsos</CardTitle>
                <CardDescription>Solicitações e aprovações de reembolsos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Nenhum reembolso cadastrado
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advances" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Adiantamentos</CardTitle>
                <CardDescription>Gestão de adiantamentos financeiros</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Nenhum adiantamento cadastrado
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="providers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Prestadores</CardTitle>
                <CardDescription>Cadastro de fornecedores e prestadores de serviço</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Nenhum prestador cadastrado
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Financeiro;