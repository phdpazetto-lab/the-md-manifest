import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StatusFilterProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange: (value?: string) => void;
}

export const StatusFilter = ({ options, value, onChange }: StatusFilterProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Label>Status</Label>
      <Select value={value || ""} onValueChange={(newValue) => onChange(newValue || undefined)}>
        <SelectTrigger>
          <SelectValue placeholder="Todos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
