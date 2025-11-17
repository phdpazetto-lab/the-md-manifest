import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createAdiantamento } from "@/lib/supabase/finance/adiantamentos";
import { useState } from "react";

const schema = z.object({
  prestador_id: z.string().min(1),
  motivo: z.string().min(3).max(200),
  valor: z.coerce.number().positive(),
  data: z.string().min(1),
  documento: z.any().optional(),
});

type AdiantamentoValues = z.infer<typeof schema>;

interface AdiantamentoFormProps {
  prestadores: { id: string; nome: string }[];
  onCreated?: () => void;
}

export const AdiantamentoForm = ({ prestadores, onCreated }: AdiantamentoFormProps) => {
  const form = useForm<AdiantamentoValues>({ resolver: zodResolver(schema) });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: AdiantamentoValues) => {
    setIsSubmitting(true);
    try {
      await createAdiantamento({ ...values, documento: values.documento instanceof File ? values.documento : null });
      form.reset();
      onCreated?.();
    } catch (error) {
      console.error(error);
      alert("Não foi possível registrar o adiantamento. Revise permissões de acesso.");
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
          <Label>Data</Label>
          <Input type="date" {...form.register("data")} />
        </div>
        <div className="space-y-2">
          <Label>Documento (PDF)</Label>
          <Input type="file" accept="application/pdf" onChange={(e) => form.setValue("documento", e.target.files?.[0])} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Motivo</Label>
        <Textarea rows={3} {...form.register("motivo")} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Registrando..." : "Registrar adiantamento"}
      </Button>
    </form>
  );
};
