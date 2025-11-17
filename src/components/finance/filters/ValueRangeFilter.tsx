import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ValueRangeFilterProps {
  min?: number;
  max?: number;
  onChange: (range: { min?: number; max?: number }) => void;
}

export const ValueRangeFilter = ({ min, max, onChange }: ValueRangeFilterProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Label>Faixa de Valor</Label>
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Mín"
          value={min ?? ""}
          onChange={(e) => onChange({ min: e.target.value ? Number(e.target.value) : undefined, max })}
        />
        <Input
          type="number"
          placeholder="Máx"
          value={max ?? ""}
          onChange={(e) => onChange({ min, max: e.target.value ? Number(e.target.value) : undefined })}
        />
      </div>
    </div>
  );
};
