import { getSupabaseClient, supabase } from "../client";
import { FinanceFilters } from "@/types/finance";
import { applyFilters } from "./common";

export async function listPagamentos(filters: FinanceFilters = {}) {
  if (!supabase) return [];
  const client = getSupabaseClient();
  const query = client.from("pagamentos").select("*").order("data_pagamento", { ascending: false });

  const { data, error } = await query;
  if (error) throw error;

  return data ? applyFilters(data, filters) : [];
}
