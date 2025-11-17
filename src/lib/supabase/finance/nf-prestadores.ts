import { getSupabaseClient, supabase } from "../client";
import { FinanceFilters } from "@/types/finance";
import { applyFilters, generateObjectPath, sanitizeString, ensureAllowedFile } from "./common";

export async function listNfsPrestadores(filters: FinanceFilters = {}) {
  if (!supabase) return [];
  const client = getSupabaseClient();
  const query = client.from("nf_prestadores").select("*").order("created_at", { ascending: false });
  const { data, error } = await query;
  if (error) throw error;
  return data ? applyFilters(data, filters) : [];
}

export async function createNfPrestador(payload: {
  prestador_id: string;
  mes_competencia: string;
  descricao: string;
  nf: File;
}) {
  if (!supabase) return null;
  const client = getSupabaseClient();

  ensureAllowedFile(payload.nf, ["application/pdf"]);
  const objectPath = generateObjectPath("finance/nf-prestadores", payload.prestador_id, ".pdf");
  const { data: uploadData, error: uploadError } = await client.storage
    .from("documents")
    .upload(objectPath, payload.nf, { upsert: true, contentType: payload.nf.type });

  if (uploadError) throw uploadError;

  const { data, error } = await client
    .from("nf_prestadores")
    .insert({
      prestador_id: payload.prestador_id,
      mes_competencia: sanitizeString(payload.mes_competencia, 7),
      descricao: sanitizeString(payload.descricao, 200),
      nf_url: uploadData?.path,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
