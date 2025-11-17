import { useEffect, useMemo, useState } from "react";
import { FinanceShell } from "@/components/finance/layout/FinanceShell";
import { PagamentosTable } from "@/components/finance/tables/PagamentosTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangeFilter } from "@/components/finance/filters/DateRangeFilter";
import { PrestadorFilter } from "@/components/finance/filters/PrestadorFilter";
import { ValueRangeFilter } from "@/components/finance/filters/ValueRangeFilter";
import { listPagamentos } from "@/lib/supabase/finance/pagamentos";
import { FinanceFilters, Pagamento, Prestador } from "@/types/finance";
import { applyFilters } from "@/lib/supabase/finance/common";

const prestadoresMock: Prestador[] = [
  { id: "1", nome: "Prestador Fixo" },
  { id: "2", nome: "Prestador Variável" },
];

const PagamentosPage = () => {
  const [items, setItems] = useState<Pagamento[]>([
    { id: "p1", prestador_id: "1", descricao: "Pagamento de serviço", valor: 1200, data_pagamento: "2024-12-12" },
  ]);
  const [filters, setFilters] = useState<FinanceFilters>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await listPagamentos(filters);
        if (data.length) setItems(data as Pagamento[]);
      } catch (error) {
        console.warn("Modo offline para pagamentos", error);
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
            <CardDescription>Combine datas e valores para encontrar pagamentos.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DateRangeFilter startDate={filters.startDate} endDate={filters.endDate} onChange={(range) => setFilters({ ...filters, ...range })} />
            <PrestadorFilter prestadores={prestadoresMock} value={filters.prestadorId} onChange={(value) => setFilters({ ...filters, prestadorId: value })} />
            <ValueRangeFilter min={filters.minValue} max={filters.maxValue} onChange={(range) => setFilters({ ...filters, minValue: range.min, maxValue: range.max })} />
          </CardContent>
        </Card>
        <PagamentosTable items={filtered as Pagamento[]} />
      </div>
    </FinanceShell>
  );
};

export default PagamentosPage;
