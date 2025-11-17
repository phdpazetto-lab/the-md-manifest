import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChangeStatusModalProps {
  trigger: ReactNode;
  options: { label: string; value: string }[];
  current: string;
  onConfirm: (status: string) => void;
}

export const ChangeStatusModal = ({ trigger, options, current, onConfirm }: ChangeStatusModalProps) => {
  const [value, setValue] = useState(current);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar status</DialogTitle>
          <DialogDescription>Selecione o novo status para o registro.</DialogDescription>
        </DialogHeader>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button onClick={() => onConfirm(value)}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
