import { FinanceFilters } from "@/types/finance";

export const allowedFinanceMimeTypes = ["application/pdf", "image/png", "image/jpeg"] as const;

export type AllowedFinanceMimeType = (typeof allowedFinanceMimeTypes)[number];

export function sanitizeString(value: string, maxLength = 255) {
  if (!value) return "";
  return value.trim().slice(0, maxLength);
}

export function applyFilters<T extends { status?: string; prestador_id?: string; valor?: number; vencimento?: string; data?: string; data_pagamento?: string; data_referencia?: string }>(
  items: T[],
  filters: FinanceFilters,
) {
  return items.filter((item) => {
    const withinStatus = filters.status ? item.status === filters.status : true;
    const withinPrestador = filters.prestadorId ? item.prestador_id === filters.prestadorId : true;
    const value = typeof item.valor === "number" ? item.valor : null;
    const withinMin = filters.minValue !== undefined && value !== null ? value >= filters.minValue : true;
    const withinMax = filters.maxValue !== undefined && value !== null ? value <= filters.maxValue : true;

    const dateString = (item as { vencimento?: string; data?: string; data_pagamento?: string; data_referencia?: string }).vencimento ||
      (item as { data?: string }).data ||
      (item as { data_pagamento?: string }).data_pagamento ||
      (item as { data_referencia?: string }).data_referencia;

    let withinDate = true;
    if (filters.startDate && dateString) {
      withinDate = new Date(dateString) >= new Date(filters.startDate);
    }
    if (filters.endDate && dateString) {
      withinDate = withinDate && new Date(dateString) <= new Date(filters.endDate);
    }

    return withinStatus && withinPrestador && withinMin && withinMax && withinDate;
  });
}

export function generateObjectPath(prefix: string, entityId: string, extension: string) {
  const safePrefix = sanitizeString(prefix, 60).replace(/[^a-zA-Z0-9-_]/g, "-") || "finance";
  const safeExtension = extension.startsWith(".") ? extension : `.${extension}`;
  const random = crypto.randomUUID();
  const timestamp = Date.now();
  return `${safePrefix}/${entityId}/${random}-${timestamp}${safeExtension}`;
}

export function ensureAllowedFile(file: File, allowed: readonly string[] = allowedFinanceMimeTypes) {
  if (!allowed.includes(file.type)) {
    throw new Error("Tipo de arquivo não permitido. Envie apenas PDFs ou imagens.");
  }
}
