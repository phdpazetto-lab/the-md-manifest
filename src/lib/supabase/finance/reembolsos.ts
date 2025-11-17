import { getSupabaseClient, supabase } from "../client";
import { FinanceFilters } from "@/types/finance";
import { applyFilters, generateObjectPath, sanitizeString, ensureAllowedFile } from "./common";

export async function listReembolsos(filters: FinanceFilters = {}) {
  if (!supabase) return [];
  const client = getSupabaseClient();
  const query = client.from("reembolsos").select("*").order("created_at", { ascending: false });
  const { data, error } = await query;
  if (error) throw error;
  return data ? applyFilters(data, filters) : [];
}

export async function createReembolso(payload: {
  prestador_id: string;
  descricao: string;
  valor: number;
  data_referencia: string;
  arquivo?: File | null;
}) {
  if (!supabase) return null;
  const client = getSupabaseClient();
  let arquivo_url: string | undefined;

  if (payload.arquivo) {
    ensureAllowedFile(payload.arquivo);
    const path = generateObjectPath("finance/reembolsos", payload.prestador_id, payload.arquivo.type === "application/pdf" ? ".pdf" : ".png");
    const { data: uploadData, error: uploadError } = await client.storage
      .from("documents")
      .upload(path, payload.arquivo, { upsert: true, contentType: payload.arquivo.type });
    if (uploadError) throw uploadError;
    arquivo_url = uploadData?.path;
  }

  const { data, error } = await client
    .from("reembolsos")
    .insert({
      prestador_id: payload.prestador_id,
      descricao: sanitizeString(payload.descricao, 200),
      valor: payload.valor,
      data_referencia: payload.data_referencia,
      status: "aguardando",
      arquivo_url,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function updateReembolso(id: string, payload: Partial<{ descricao: string; valor: number }>) {
  if (!supabase) return null;
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("reembolsos")
    .update({
      descricao: payload.descricao ? sanitizeString(payload.descricao, 200) : undefined,
      valor: payload.valor,
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteReembolso(id: string) {
  if (!supabase) return null;
  const client = getSupabaseClient();
  const { error } = await client.from("reembolsos").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function alterarStatusReembolso(id: string, status: string) {
  if (!supabase) return null;
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("reembolsos")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
