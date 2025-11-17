import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { FinanceSidebar } from "./FinanceSidebar";
import { FinanceHeader } from "./FinanceHeader";

interface FinanceShellProps {
  children?: ReactNode;
}

export const FinanceShell = ({ children }: FinanceShellProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground grid grid-cols-[260px_1fr]">
      <FinanceSidebar />
      <div className="flex flex-col min-h-screen border-l">
        <FinanceHeader />
        <main className="flex-1 p-6 space-y-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
