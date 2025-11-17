import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createContaAPagar } from "@/lib/supabase/finance/contas-a-pagar";
import { useState } from "react";

const contaSchema = z.object({
  prestador_id: z.string().min(1, "Selecione o prestador"),
  tipo: z.enum(["NF", "Boleto", "Outros"]),
  descricao: z.string().min(3).max(200),
  valor: z.coerce.number().positive("Valor deve ser positivo"),
  vencimento: z.string().min(1),
  status: z.enum(["pendente", "pago", "cancelado"]),
  arquivo: z.any().optional(),
});

export type ContaFormValues = z.infer<typeof contaSchema>;

interface ContaPagarFormProps {
  prestadores: { id: string; nome: string }[];
  onCreated?: () => void;
}

export const ContaPagarForm = ({ prestadores, onCreated }: ContaPagarFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ContaFormValues>({ resolver: zodResolver(contaSchema) });

  const onSubmit = async (values: ContaFormValues) => {
    setIsSubmitting(true);
    try {
      await createContaAPagar({ ...values, arquivo: values.arquivo instanceof File ? values.arquivo : null });
      onCreated?.();
      form.reset();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar conta a pagar. Verifique suas credenciais e políticas de acesso.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Prestador</Label>
          <Select onValueChange={(value) => form.setValue("prestador_id", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {prestadores.map((prestador) => (
                <SelectItem key={prestador.id} value={prestador.id}>
                  {prestador.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tipo</Label>
          <Select onValueChange={(value) => form.setValue("tipo", value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="NF" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NF">Nota Fiscal</SelectItem>
              <SelectItem value="Boleto">Boleto</SelectItem>
              <SelectItem value="Outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Descrição</Label>
          <Input {...form.register("descricao")} placeholder="Descrição curta" />
        </div>
        <div className="space-y-2">
          <Label>Valor (R$)</Label>
          <Input type="number" step="0.01" {...form.register("valor")}/>
        </div>
        <div className="space-y-2">
          <Label>Vencimento</Label>
          <Input type="date" {...form.register("vencimento")} />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select onValueChange={(value) => form.setValue("status", value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="pendente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Documento (PDF)</Label>
          <Input type="file" accept="application/pdf" onChange={(e) => form.setValue("arquivo", e.target.files?.[0])} />
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
};
