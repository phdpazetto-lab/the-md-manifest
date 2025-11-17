import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChangeStatusModal } from "../modals/ChangeStatusModal";
import { ConfirmDeleteModal } from "../modals/ConfirmDeleteModal";
import { Reembolso } from "@/types/finance";

interface ReembolsosTableProps {
  items: Reembolso[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

const statusOptions = [
  { value: "aguardando", label: "Aguardando" },
  { value: "aprovado", label: "Aprovado" },
  { value: "recusado", label: "Recusado" },
  { value: "pago", label: "Pago" },
];

export const ReembolsosTable = ({ items, onDelete, onStatusChange }: ReembolsosTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reembolsos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Prestador</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Arquivo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.descricao}</TableCell>
                  <TableCell>{item.prestador_id}</TableCell>
                  <TableCell>{item.data_referencia}</TableCell>
                  <TableCell>R$ {item.valor?.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{statusOptions.find((s) => s.value === item.status)?.label || item.status}</Badge>
                  </TableCell>
                  <TableCell>{item.arquivo_url ? "Enviado" : "-"}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <ChangeStatusModal
                      trigger={<Button variant="outline" size="sm">Status</Button>}
                      current={item.status}
                      options={statusOptions}
                      onConfirm={(status) => onStatusChange(item.id, status)}
                    />
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
