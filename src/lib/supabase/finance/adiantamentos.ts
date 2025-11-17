import { getSupabaseClient, supabase } from "../client";
import { FinanceFilters } from "@/types/finance";
import { applyFilters, generateObjectPath, sanitizeString, ensureAllowedFile } from "./common";

export async function listAdiantamentos(filters: FinanceFilters = {}) {
  if (!supabase) return [];
  const client = getSupabaseClient();
  const query = client.from("adiantamentos").select("*").order("data", { ascending: false });
  const { data, error } = await query;
  if (error) throw error;
  return data ? applyFilters(data, filters) : [];
}

export async function createAdiantamento(payload: {
  prestador_id: string;
  motivo: string;
  valor: number;
  data: string;
  documento?: File | null;
}) {
  if (!supabase) return null;
  const client = getSupabaseClient();
  let documento_url: string | undefined;

  if (payload.documento) {
    ensureAllowedFile(payload.documento, ["application/pdf"]);
    const path = generateObjectPath("finance/adiantamentos", payload.prestador_id, ".pdf");
    const { data: uploadData, error: uploadError } = await client.storage
      .from("documents")
      .upload(path, payload.documento, { upsert: true, contentType: payload.documento.type });
    if (uploadError) throw uploadError;
    documento_url = uploadData?.path;
  }

  const { data, error } = await client
    .from("adiantamentos")
    .insert({
      prestador_id: payload.prestador_id,
      motivo: sanitizeString(payload.motivo, 200),
      valor: payload.valor,
      data: payload.data,
      documento_url,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteAdiantamento(id: string) {
  if (!supabase) return null;
  const client = getSupabaseClient();
  const { error } = await client.from("adiantamentos").delete().eq("id", id);
  if (error) throw error;
  return true;
}
