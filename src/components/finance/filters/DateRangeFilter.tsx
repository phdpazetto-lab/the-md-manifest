import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DateRangeFilterProps {
  startDate?: string;
  endDate?: string;
  onChange: (range: { startDate?: string; endDate?: string }) => void;
}

export const DateRangeFilter = ({ startDate, endDate, onChange }: DateRangeFilterProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Label>Período</Label>
      <div className="flex gap-2">
        <Input
          type="date"
          value={startDate || ""}
          onChange={(e) => onChange({ startDate: e.target.value, endDate })}
        />
        <Input
          type="date"
          value={endDate || ""}
          onChange={(e) => onChange({ startDate, endDate: e.target.value })}
        />
      </div>
    </div>
  );
};
