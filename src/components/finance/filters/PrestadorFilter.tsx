import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Prestador } from "@/types/finance";

interface PrestadorFilterProps {
  prestadores: Prestador[];
  value?: string;
  onChange: (value?: string) => void;
}

export const PrestadorFilter = ({ prestadores, value, onChange }: PrestadorFilterProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Label>Prestador</Label>
      <Select value={value || ""} onValueChange={(newValue) => onChange(newValue || undefined)}>
        <SelectTrigger>
          <SelectValue placeholder="Todos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos</SelectItem>
          {prestadores.map((prestador) => (
            <SelectItem key={prestador.id} value={prestador.id}>
              {prestador.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
