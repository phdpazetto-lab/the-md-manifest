import { getSupabaseClient, supabase } from "../client";
import { FinanceFilters, Pagamento } from "@/types/finance";
import { applyFilters, generateObjectPath, sanitizeString, ensureAllowedFile } from "./common";

export async function listContasAPagar(filters: FinanceFilters = {}) {
  if (!supabase) return [];
  const client = getSupabaseClient();
  const query = client.from("contas_a_pagar").select("*").order("vencimento", { ascending: true });

  const { data, error } = await query;
  if (error) throw error;

  return data ? applyFilters(data, filters) : [];
}

export async function createContaAPagar(payload: {
  prestador_id: string;
  tipo: string;
  descricao: string;
  valor: number;
  vencimento: string;
  status: string;
  arquivo?: File | null;
}) {
  if (!supabase) return null;
  const client = getSupabaseClient();
  let arquivo_url: string | undefined;

  if (payload.arquivo) {
    ensureAllowedFile(payload.arquivo, ["application/pdf"]);
    const path = generateObjectPath("finance/contas-a-pagar", payload.prestador_id, ".pdf");
    const { data: uploadData, error: uploadError } = await client.storage
      .from("documents")
      .upload(path, payload.arquivo, { upsert: true, contentType: payload.arquivo.type });

    if (uploadError) throw uploadError;
    arquivo_url = uploadData?.path;
  }

  const { data, error } = await client
    .from("contas_a_pagar")
    .insert({
      prestador_id: payload.prestador_id,
      tipo: sanitizeString(payload.tipo, 50),
      descricao: sanitizeString(payload.descricao, 200),
      valor: payload.valor,
      vencimento: payload.vencimento,
      status: payload.status,
      arquivo_url,
      origem: "manual",
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function updateContaAPagar(id: string, payload: Partial<{ descricao: string; status: string; vencimento: string }>) {
  if (!supabase) return null;
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("contas_a_pagar")
    .update({
      descricao: payload.descricao ? sanitizeString(payload.descricao, 200) : undefined,
      status: payload.status,
      vencimento: payload.vencimento,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function deleteContaAPagar(id: string) {
  if (!supabase) return null;
  const client = getSupabaseClient();
  const { error } = await client.from("contas_a_pagar").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function marcarContaComoPaga(id: string, pagamentoPayload: Pagamento) {
  if (!supabase) return null;
  const client = getSupabaseClient();
  const { error: updateError } = await client.from("contas_a_pagar").update({ status: "pago" }).eq("id", id);
  if (updateError) throw updateError;

  const { data, error } = await client
    .from("pagamentos")
    .insert({
      conta_id: id,
      prestador_id: pagamentoPayload.prestador_id,
      descricao: sanitizeString(pagamentoPayload.descricao, 200),
      valor: pagamentoPayload.valor,
      data_pagamento: pagamentoPayload.data_pagamento,
      comprovante_url: pagamentoPayload.comprovante_url,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
