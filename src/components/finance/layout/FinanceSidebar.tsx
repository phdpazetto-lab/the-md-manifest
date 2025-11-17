import { NavLink } from "react-router-dom";
import { Banknote, FileText, Landmark, LineChart, Wallet, ReceiptText } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/finance", label: "Visão Geral", icon: LineChart },
  { to: "/finance/contas-a-pagar", label: "Contas a Pagar", icon: FileText },
  { to: "/finance/pagamentos", label: "Pagamentos", icon: Banknote },
  { to: "/finance/reembolsos", label: "Reembolsos", icon: ReceiptText },
  { to: "/finance/adiantamentos", label: "Adiantamentos", icon: Wallet },
  { to: "/finance/notas-fiscais", label: "NF Prestadores", icon: Landmark },
];

export const FinanceSidebar = () => {
  return (
    <aside className="border-r bg-card text-card-foreground min-h-screen p-4 space-y-2">
      <div className="px-2 pb-4">
        <p className="text-xs uppercase text-muted-foreground">Módulo</p>
        <h2 className="text-xl font-semibold">Financeiro</h2>
      </div>
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                isActive ? "bg-muted text-primary" : "text-foreground",
              )
            }
            end={link.to === "/finance"}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
