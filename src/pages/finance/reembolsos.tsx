import { useEffect, useMemo, useState } from "react";
import { FinanceShell } from "@/components/finance/layout/FinanceShell";
import { ReembolsoForm } from "@/components/finance/forms/ReembolsoForm";
import { ReembolsosTable } from "@/components/finance/tables/ReembolsosTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangeFilter } from "@/components/finance/filters/DateRangeFilter";
import { PrestadorFilter } from "@/components/finance/filters/PrestadorFilter";
import { StatusFilter } from "@/components/finance/filters/StatusFilter";
import { ValueRangeFilter } from "@/components/finance/filters/ValueRangeFilter";
import { alterarStatusReembolso, deleteReembolso, listReembolsos } from "@/lib/supabase/finance/reembolsos";
import { FinanceFilters, Prestador, Reembolso } from "@/types/finance";
import { applyFilters } from "@/lib/supabase/finance/common";

const prestadoresMock: Prestador[] = [
  { id: "1", nome: "Prestador Fixo" },
  { id: "2", nome: "Prestador Variável" },
];

const ReembolsosPage = () => {
  const [items, setItems] = useState<Reembolso[]>([
    { id: "r1", prestador_id: "1", descricao: "Deslocamento", valor: 150, data_referencia: "2024-12-05", status: "aguardando" },
  ]);
  const [filters, setFilters] = useState<FinanceFilters>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await listReembolsos(filters);
        if (data.length) setItems(data as Reembolso[]);
      } catch (error) {
        console.warn("Modo offline para reembolsos", error);
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
            <CardDescription>Respeitando regras RLS: prestadores visualizam apenas seus registros.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <DateRangeFilter startDate={filters.startDate} endDate={filters.endDate} onChange={(range) => setFilters({ ...filters, ...range })} />
            <PrestadorFilter prestadores={prestadoresMock} value={filters.prestadorId} onChange={(value) => setFilters({ ...filters, prestadorId: value })} />
            <StatusFilter
              options={[
                { value: "aguardando", label: "Aguardando" },
                { value: "aprovado", label: "Aprovado" },
                { value: "recusado", label: "Recusado" },
                { value: "pago", label: "Pago" },
              ]}
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
            />
            <ValueRangeFilter min={filters.minValue} max={filters.maxValue} onChange={(range) => setFilters({ ...filters, minValue: range.min, maxValue: range.max })} />
          </CardContent>
        </Card>

        <Tabs defaultValue="listar">
          <TabsList>
            <TabsTrigger value="listar">Listagem</TabsTrigger>
            <TabsTrigger value="novo">Solicitar</TabsTrigger>
          </TabsList>
          <TabsContent value="listar" className="space-y-4">
            <ReembolsosTable
              items={filteredItems}
              onDelete={async (id) => {
                try {
                  await deleteReembolso(id);
                } catch (error) {
                  console.warn("Exclusão local", error);
                }
                setItems((prev) => prev.filter((item) => item.id !== id));
              }}
              onStatusChange={async (id, status) => {
                try {
                  await alterarStatusReembolso(id, status);
                  setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
                } catch (error) {
                  console.error(error);
                  alert("Sem permissão para alterar status neste ambiente.");
                }
              }}
            />
          </TabsContent>
          <TabsContent value="novo">
            <Card>
              <CardHeader>
                <CardTitle>Solicitar Reembolso</CardTitle>
                <CardDescription>Validação e sanitização com Zod e filtros de MIME.</CardDescription>
              </CardHeader>
              <CardContent>
                <ReembolsoForm prestadores={prestadoresMock} onCreated={() => listReembolsos({}).then((data) => data.length && setItems(data as Reembolso[]))} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </FinanceShell>
  );
};

export default ReembolsosPage;
