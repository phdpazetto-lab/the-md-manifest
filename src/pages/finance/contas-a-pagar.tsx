import { useEffect, useMemo, useState } from "react";
import { FinanceShell } from "@/components/finance/layout/FinanceShell";
import { ContaPagarForm } from "@/components/finance/forms/ContaPagarForm";
import { ContasAPagarTable } from "@/components/finance/tables/ContasAPagarTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangeFilter } from "@/components/finance/filters/DateRangeFilter";
import { PrestadorFilter } from "@/components/finance/filters/PrestadorFilter";
import { StatusFilter } from "@/components/finance/filters/StatusFilter";
import { ValueRangeFilter } from "@/components/finance/filters/ValueRangeFilter";
import { listContasAPagar, updateContaAPagar, deleteContaAPagar } from "@/lib/supabase/finance/contas-a-pagar";
import { FinanceFilters, Prestador } from "@/types/finance";
import { applyFilters } from "@/lib/supabase/finance/common";

const prestadoresMock: Prestador[] = [
  { id: "1", nome: "Prestador Fixo", tipo: "fixo" },
  { id: "2", nome: "Prestador Variável", tipo: "variavel" },
];

const ContasAPagarPage = () => {
  const [items, setItems] = useState<any[]>([
    { id: "1", prestador_id: "1", tipo: "NF", descricao: "Serviço mensal", valor: 1200, vencimento: "2024-12-10", status: "pendente", origem: "manual" },
  ]);
  const [filters, setFilters] = useState<FinanceFilters>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await listContasAPagar(filters);
        if (data.length) setItems(data);
      } catch (error) {
        console.warn("Modo offline para contas a pagar", error);
      }
    };
    fetchData();
  }, [filters]);

  const filteredItems = useMemo(() => applyFilters(items, filters), [items, filters]);

  return (
    <FinanceShell>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Segmente informações de forma segura.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <DateRangeFilter
              startDate={filters.startDate}
              endDate={filters.endDate}
              onChange={(range) => setFilters({ ...filters, ...range })}
            />
            <PrestadorFilter prestadores={prestadoresMock} value={filters.prestadorId} onChange={(value) => setFilters({ ...filters, prestadorId: value })} />
            <StatusFilter
              options={[{ value: "pendente", label: "Pendente" }, { value: "pago", label: "Pago" }, { value: "cancelado", label: "Cancelado" }]}
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
            />
            <ValueRangeFilter
              min={filters.minValue}
              max={filters.maxValue}
              onChange={(range) => setFilters({ ...filters, minValue: range.min, maxValue: range.max })}
            />
          </CardContent>
        </Card>

        <Tabs defaultValue="listar">
          <TabsList>
            <TabsTrigger value="listar">Listagem</TabsTrigger>
            <TabsTrigger value="novo">Nova conta</TabsTrigger>
          </TabsList>
          <TabsContent value="listar" className="space-y-4">
            <ContasAPagarTable
              items={filteredItems}
              onDelete={async (id) => {
                try {
                  await deleteContaAPagar(id);
                } catch (error) {
                  console.warn("Exclusão local (offline)", error);
                }
                setItems((prev) => prev.filter((item) => item.id !== id));
              }}
              onStatusChange={async (id, status) => {
                try {
                  await updateContaAPagar(id, { status });
                  setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
                } catch (error) {
                  console.error(error);
                  alert("Falha ao alterar status. Verifique suas permissões de acesso.");
                }
              }}
            />
          </TabsContent>
          <TabsContent value="novo">
            <Card>
              <CardHeader>
                <CardTitle>Nova conta a pagar</CardTitle>
                <CardDescription>Uploads restritos a PDF e higienização dos campos.</CardDescription>
              </CardHeader>
              <CardContent>
                <ContaPagarForm
                  prestadores={prestadoresMock}
                  onCreated={() => {
                    listContasAPagar({}).then((data) => data.length && setItems(data));
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </FinanceShell>
  );
};

export default ContasAPagarPage;
