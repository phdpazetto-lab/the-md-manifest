import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createReembolso } from "@/lib/supabase/finance/reembolsos";
import { useState } from "react";

const schema = z.object({
  prestador_id: z.string().min(1),
  descricao: z.string().min(3).max(200),
  valor: z.coerce.number().positive(),
  data_referencia: z.string().min(1),
  arquivo: z.any().optional(),
});

type ReembolsoFormValues = z.infer<typeof schema>;

interface ReembolsoFormProps {
  prestadores: { id: string; nome: string }[];
  onCreated?: () => void;
}

export const ReembolsoForm = ({ prestadores, onCreated }: ReembolsoFormProps) => {
  const form = useForm<ReembolsoFormValues>({ resolver: zodResolver(schema) });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: ReembolsoFormValues) => {
    setIsSubmitting(true);
    try {
      await createReembolso({ ...values, arquivo: values.arquivo instanceof File ? values.arquivo : null });
      form.reset();
      onCreated?.();
    } catch (error) {
      console.error(error);
      alert("Não foi possível enviar o reembolso. Verifique permissões e formato do arquivo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Prestador</Label>
          <select
            className="w-full rounded-md border border-input bg-transparent px-3 py-2"
            {...form.register("prestador_id")}
            defaultValue=""
          >
            <option value="" disabled>
              Selecione
            </option>
            {prestadores.map((prestador) => (
              <option key={prestador.id} value={prestador.id}>
                {prestador.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Valor</Label>
          <Input type="number" step="0.01" {...form.register("valor")} />
        </div>
        <div className="space-y-2">
          <Label>Data do gasto</Label>
          <Input type="date" {...form.register("data_referencia")} />
        </div>
        <div className="space-y-2">
          <Label>Comprovante</Label>
          <Input type="file" accept="application/pdf,image/png,image/jpeg" onChange={(e) => form.setValue("arquivo", e.target.files?.[0])} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Descrição</Label>
        <Textarea rows={3} {...form.register("descricao")} placeholder="Descreva o gasto" />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Solicitar reembolso"}
      </Button>
    </form>
  );
};
