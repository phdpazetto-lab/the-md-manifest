import { useEffect, useMemo, useState } from "react";
import { FinanceShell } from "@/components/finance/layout/FinanceShell";
import { NfPrestadorForm } from "@/components/finance/forms/NfPrestadorForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DateRangeFilter } from "@/components/finance/filters/DateRangeFilter";
import { PrestadorFilter } from "@/components/finance/filters/PrestadorFilter";
import { listNfsPrestadores } from "@/lib/supabase/finance/nf-prestadores";
import { FinanceFilters, NfPrestador, Prestador } from "@/types/finance";
import { applyFilters } from "@/lib/supabase/finance/common";

const prestadoresMock: Prestador[] = [
  { id: "1", nome: "Prestador Fixo", tipo: "fixo" },
  { id: "2", nome: "Prestador Variável", tipo: "variavel" },
];

const NfPrestadoresPage = () => {
  const [items, setItems] = useState<NfPrestador[]>([
    { id: "n1", prestador_id: "1", mes_competencia: "12/2024", descricao: "Nota do mês" },
  ]);
  const [filters, setFilters] = useState<FinanceFilters>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await listNfsPrestadores(filters);
        if (data.length) setItems(data as NfPrestador[]);
      } catch (error) {
        console.warn("Modo offline para NF", error);
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
            <CardDescription>Prestadores fixos geram contas a pagar automaticamente.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateRangeFilter startDate={filters.startDate} endDate={filters.endDate} onChange={(range) => setFilters({ ...filters, ...range })} />
            <PrestadorFilter prestadores={prestadoresMock} value={filters.prestadorId} onChange={(value) => setFilters({ ...filters, prestadorId: value })} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notas recebidas</CardTitle>
            <CardDescription>Uploads limitados a PDF com nome randomizado.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prestador</TableHead>
                    <TableHead>Mês</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Arquivo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.prestador_id}</TableCell>
                      <TableCell>{item.mes_competencia}</TableCell>
                      <TableCell>{item.descricao}</TableCell>
                      <TableCell>{item.nf_url ? "Enviado" : "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enviar nota fiscal</CardTitle>
            <CardDescription>Prestadores carregam PDF que alimenta Contas a Pagar.</CardDescription>
          </CardHeader>
          <CardContent>
            <NfPrestadorForm
              prestadores={prestadoresMock}
              onCreated={() => listNfsPrestadores({}).then((data) => data.length && setItems(data as NfPrestador[]))}
            />
          </CardContent>
        </Card>
      </div>
    </FinanceShell>
  );
};

export default NfPrestadoresPage;
