export type FinanceRole = "prestador" | "financeiro" | "admin";

export interface FinanceBaseRecord {
  id: string;
  created_at?: string;
  updated_at?: string | null;
}

export interface Prestador extends FinanceBaseRecord {
  nome: string;
  email?: string | null;
  tipo?: "fixo" | "variavel" | null;
  ativo?: boolean;
}

export interface ContaAPagar extends FinanceBaseRecord {
  prestador_id: string;
  tipo: "NF" | "Boleto" | "Outros";
  descricao: string;
  valor: number;
  vencimento: string;
  status: "pendente" | "pago" | "cancelado";
  arquivo_url?: string | null;
  origem?: "manual" | "nf_prestador";
}

export interface Pagamento extends FinanceBaseRecord {
  conta_id?: string | null;
  prestador_id: string;
  descricao: string;
  valor: number;
  data_pagamento: string;
  comprovante_url?: string | null;
}

export interface Reembolso extends FinanceBaseRecord {
  prestador_id: string;
  descricao: string;
  valor: number;
  data_referencia: string;
  status: "aguardando" | "aprovado" | "recusado" | "pago";
  arquivo_url?: string | null;
}

export interface Adiantamento extends FinanceBaseRecord {
  prestador_id: string;
  motivo: string;
  valor: number;
  data: string;
  documento_url?: string | null;
}

export interface NfPrestador extends FinanceBaseRecord {
  prestador_id: string;
  mes_competencia: string;
  descricao: string;
  nf_url?: string | null;
}

export interface FinanceFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  prestadorId?: string;
  minValue?: number;
  maxValue?: number;
}
