import type {
  CatalogTitle,
  PageResult,
  TrackerStatus,
  WatchEntry,
  WatchStatus
} from "./types";

const configuredBase = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";
const API_BASE = configuredBase.replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(API_BASE + path, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers
    }
  });

  const payload = (await response.json().catch(() => ({}))) as {
    error?: string;
  } & T;

  if (!response.ok) {
    throw new Error(payload.error || `Richiesta fallita (HTTP ${response.status})`);
  }

  return payload as T;
}

function post<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export const api = {
  trackerStatus: () => request<TrackerStatus>("/api/tracker/status"),

  catalog: (query: string, offset = 0, limit = 60) => {
    const params = new URLSearchParams({
      q: query,
      offset: String(offset),
      limit: String(limit)
    });
    return request<PageResult<CatalogTitle>>(
      `/api/tracker/catalog?${params.toString()}`
    );
  },

  watchlist: (query = "", status = "") => {
    const params = new URLSearchParams({ q: query, status });
    return request<PageResult<WatchEntry>>(
      `/api/tracker/watchlist?${params.toString()}`
    );
  },

  syncCatalog: (provider: string) =>
    post<{ ok: boolean; state: string }>("/api/tracker/sync", { provider }),

  addToWatchlist: (id: string) =>
    post<WatchEntry>("/api/tracker/add", { id }),

  removeFromWatchlist: (id: string) =>
    post<{ ok: boolean }>("/api/tracker/remove", { id }),

  updateWatchEntry: (entry: WatchEntry, status: WatchStatus) =>
    post<WatchEntry>("/api/tracker/update", {
      id: entry.id,
      status,
      rating: entry.rating,
      notes: entry.notes,
      startedAt: entry.startedAt ?? "",
      completedAt: entry.completedAt ?? "",
      provider: entry.selectedProvider ?? ""
    }),

  trackerDetail: async (id: string) => {
    const params = new URLSearchParams({ id });
    const result = await request<{ entry: WatchEntry }>(
      `/api/tracker/detail?${params.toString()}`
    );
    return result.entry;
  },

  setEpisodeWatched: (id: string, number: string, watched: boolean) =>
    post<WatchEntry>("/api/tracker/episode", { id, number, watched })
};
