import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createNfPrestador } from "@/lib/supabase/finance/nf-prestadores";
import { useState } from "react";

const schema = z.object({
  prestador_id: z.string().min(1),
  mes_competencia: z.string().regex(/^\d{2}\/\d{4}$/),
  descricao: z.string().min(3).max(200),
  nf: z.any(),
});

type NfPrestadorValues = z.infer<typeof schema>;

interface NfPrestadorFormProps {
  prestadores: { id: string; nome: string }[];
  onCreated?: () => void;
}

export const NfPrestadorForm = ({ prestadores, onCreated }: NfPrestadorFormProps) => {
  const form = useForm<NfPrestadorValues>({ resolver: zodResolver(schema) });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: NfPrestadorValues) => {
    setIsSubmitting(true);
    try {
      if (!(values.nf instanceof File)) {
        throw new Error("Envie o arquivo PDF da nota.");
      }
      await createNfPrestador(values);
      onCreated?.();
      form.reset();
    } catch (error) {
      console.error(error);
      alert("Não foi possível enviar a nota fiscal. Verifique o formato e seu nível de acesso.");
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
          <Label>Mês de competência</Label>
          <Input placeholder="MM/AAAA" {...form.register("mes_competencia")}/>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Descrição</Label>
          <Textarea rows={2} {...form.register("descricao")} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Nota Fiscal (PDF)</Label>
          <Input type="file" accept="application/pdf" onChange={(e) => form.setValue("nf", e.target.files?.[0])} />
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar NF"}
      </Button>
    </form>
  );
};
