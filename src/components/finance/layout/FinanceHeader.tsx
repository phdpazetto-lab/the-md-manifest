import { ShieldCheck, ShieldX, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const roleDescriptions: Record<string, string> = {
  prestador: "Acesso limitado aos próprios registros.",
  financeiro: "Gestão total do módulo financeiro.",
  admin: "Acesso global para auditoria e governança.",
};

const roleColors: Record<string, string> = {
  prestador: "secondary",
  financeiro: "default",
  admin: "destructive",
};

export const FinanceHeader = () => {
  const role = (localStorage.getItem("finance-role") || "prestador") as keyof typeof roleDescriptions;

  return (
    <header className="w-full border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-muted-foreground">Segurança • RBAC + RLS</p>
          <h1 className="text-2xl font-semibold">Módulo Financeiro</h1>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="flex items-center gap-2 text-sm">
              <Badge variant={roleColors[role] as any} className="flex items-center gap-1">
                {role === "admin" ? <ShieldCheck className="h-4 w-4" /> : role === "financeiro" ? <UserRound className="h-4 w-4" /> : <ShieldX className="h-4 w-4" />} 
                {role}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{roleDescriptions[role]}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
};
