import { Redis } from "@upstash/redis";

/**
 * Magazyn zapytań ofertowych (Upstash Redis / Vercel KV).
 * Bez konfiguracji (brak zmiennych) działa w trybie no-op — aplikacja się nie wywala,
 * po prostu nic nie zapisuje/nie listuje, dopóki nie podepniesz bazy w Vercel → Storage.
 */
const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

export const redis = url && token ? new Redis({ url, token }) : null;
export const storageReady = !!redis;

export type Zapytanie = {
  id: string;
  imie_nazwisko: string;
  firma?: string;
  telefon: string;
  email: string;
  wiadomosc: string;
  produkt?: string;
  utworzono: string; // ISO 8601
};

const INDEX = "zapytania:index";
const recordKey = (id: string) => `zapytanie:${id}`;

export async function saveInquiry(
  data: Omit<Zapytanie, "id" | "utworzono">
): Promise<boolean> {
  if (!redis) return false;
  const id = crypto.randomUUID();
  const rec: Zapytanie = { ...data, id, utworzono: new Date().toISOString() };
  await redis.set(recordKey(id), rec);
  await redis.zadd(INDEX, { score: Date.now(), member: id });
  return true;
}

export async function listInquiries(): Promise<Zapytanie[]> {
  if (!redis) return [];
  const ids = (await redis.zrange(INDEX, 0, -1, { rev: true })) as string[];
  if (!ids.length) return [];
  const recs = (await redis.mget(...ids.map(recordKey))) as (Zapytanie | null)[];
  return recs.filter((r): r is Zapytanie => !!r);
}

export async function deleteInquiry(id: string): Promise<boolean> {
  if (!redis) return false;
  await redis.del(recordKey(id));
  await redis.zrem(INDEX, id);
  return true;
}
