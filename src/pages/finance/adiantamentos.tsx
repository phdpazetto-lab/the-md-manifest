import { useEffect, useMemo, useState } from "react";
import { FinanceShell } from "@/components/finance/layout/FinanceShell";
import { AdiantamentoForm } from "@/components/finance/forms/AdiantamentoForm";
import { AdiantamentosTable } from "@/components/finance/tables/AdiantamentosTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangeFilter } from "@/components/finance/filters/DateRangeFilter";
import { PrestadorFilter } from "@/components/finance/filters/PrestadorFilter";
import { ValueRangeFilter } from "@/components/finance/filters/ValueRangeFilter";
import { createAdiantamento, deleteAdiantamento, listAdiantamentos } from "@/lib/supabase/finance/adiantamentos";
import { FinanceFilters, Adiantamento, Prestador } from "@/types/finance";
import { applyFilters } from "@/lib/supabase/finance/common";

const prestadoresMock: Prestador[] = [
  { id: "1", nome: "Prestador Fixo" },
  { id: "2", nome: "Prestador Variável" },
];

const AdiantamentosPage = () => {
  const [items, setItems] = useState<Adiantamento[]>([
    { id: "a1", prestador_id: "2", motivo: "Materiais", valor: 300, data: "2024-12-02" },
  ]);
  const [filters, setFilters] = useState<FinanceFilters>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await listAdiantamentos(filters);
        if (data.length) setItems(data as Adiantamento[]);
      } catch (error) {
        console.warn("Modo offline para adiantamentos", error);
      }
    };
    fetchData();
  }, [filters]);

  const filtered = useMemo(() => applyFilters(items, filters), [items, filters]);

  return (
    <FinanceShell>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Combine datas e valores, com visibilidade controlada por RLS.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DateRangeFilter startDate={filters.startDate} endDate={filters.endDate} onChange={(range) => setFilters({ ...filters, ...range })} />
            <PrestadorFilter prestadores={prestadoresMock} value={filters.prestadorId} onChange={(value) => setFilters({ ...filters, prestadorId: value })} />
            <ValueRangeFilter min={filters.minValue} max={filters.maxValue} onChange={(range) => setFilters({ ...filters, minValue: range.min, maxValue: range.max })} />
          </CardContent>
        </Card>

        <Tabs defaultValue="listar">
          <TabsList>
            <TabsTrigger value="listar">Listagem</TabsTrigger>
            <TabsTrigger value="novo">Novo</TabsTrigger>
          </TabsList>
          <TabsContent value="listar" className="space-y-4">
            <AdiantamentosTable
              items={filtered}
              onDelete={async (id) => {
                try {
                  await deleteAdiantamento(id);
                } catch (error) {
                  console.warn("Exclusão local", error);
                }
                setItems((prev) => prev.filter((item) => item.id !== id));
              }}
            />
          </TabsContent>
          <TabsContent value="novo">
            <Card>
              <CardHeader>
                <CardTitle>Novo adiantamento</CardTitle>
                <CardDescription>Uploads restritos a PDF com nomes randômicos.</CardDescription>
              </CardHeader>
              <CardContent>
                <AdiantamentoForm
                  prestadores={prestadoresMock}
                  onCreated={() =>
                    listAdiantamentos({}).then((data) => data.length && setItems(data as Adiantamento[]))
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </FinanceShell>
  );
};

export default AdiantamentosPage;
