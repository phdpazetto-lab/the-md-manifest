import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteModal } from "../modals/ConfirmDeleteModal";
import { Adiantamento } from "@/types/finance";

interface AdiantamentosTableProps {
  items: Adiantamento[];
  onDelete: (id: string) => void;
}

export const AdiantamentosTable = ({ items, onDelete }: AdiantamentosTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Adiantamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Beneficiário</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.prestador_id}</TableCell>
                  <TableCell>{item.data}</TableCell>
                  <TableCell>{item.motivo}</TableCell>
                  <TableCell>R$ {item.valor?.toFixed(2)}</TableCell>
                  <TableCell>{item.documento_url ? "Enviado" : "-"}</TableCell>
                  <TableCell className="flex justify-end">
                    <ConfirmDeleteModal
                      trigger={<Button variant="ghost" size="sm">Excluir</Button>}
                      onConfirm={() => onDelete(item.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
