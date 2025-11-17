import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChangeStatusModal } from "../modals/ChangeStatusModal";
import { ConfirmDeleteModal } from "../modals/ConfirmDeleteModal";
import { ContaAPagar } from "@/types/finance";

interface ContasAPagarTableProps {
  items: ContaAPagar[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

const statusMap: Record<string, { label: string; variant: "secondary" | "outline" | "default" | "destructive" }>= {
  pendente: { label: "Pendente", variant: "secondary" },
  pago: { label: "Pago", variant: "default" },
  cancelado: { label: "Cancelado", variant: "destructive" },
};

export const ContasAPagarTable = ({ items, onDelete, onStatusChange }: ContasAPagarTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contas a Pagar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Prestador</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.descricao}</TableCell>
                  <TableCell>{item.prestador_id}</TableCell>
                  <TableCell>{item.vencimento}</TableCell>
                  <TableCell>R$ {item.valor?.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={statusMap[item.status]?.variant || "outline"}>
                      {statusMap[item.status]?.label || item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.origem || "manual"}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <ChangeStatusModal
                      trigger={<Button variant="outline" size="sm">Status</Button>}
                      current={item.status}
                      options={[
                        { value: "pendente", label: "Pendente" },
                        { value: "pago", label: "Pago" },
                        { value: "cancelado", label: "Cancelado" },
                      ]}
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
