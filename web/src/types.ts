export type WatchStatus =
  | "Da iniziare"
  | "In visione"
  | "Completato"
  | "In pausa"
  | "Abbandonato";

export interface CatalogSource {
  provider: string;
  url: string;
  poster?: string;
  sourceId?: string;
}

export interface CatalogTitle {
  id: string;
  name: string;
  year?: number;
  kind?: string;
  description?: string;
  poster?: string;
  sources: CatalogSource[];
  updatedAt: string;
  inList?: boolean;
}

export interface TrackedEpisode {
  number: string;
  season?: number;
  episodeNo?: number;
  title?: string;
  pageUrl?: string;
  watched: boolean;
  watchedAt?: string;
}

export interface WatchEntry {
  id: string;
  title: string;
  year?: number;
  poster?: string;
  kind?: string;
  sources: CatalogSource[];
  selectedProvider?: string;
  status: WatchStatus;
  rating: number;
  notes: string;
  startedAt?: string;
  completedAt?: string;
  addedAt: string;
  updatedAt: string;
  episodes: TrackedEpisode[];
}

export interface PageResult<T> {
  items: T[];
  total: number;
  offset: number;
  limit: number;
}

export interface CatalogSyncStatus {
  provider: string;
  state: string;
  pagesScanned: number;
  itemsFound: number;
  lastSync?: string;
  lastError?: string;
  updatedAt: string;
}

export interface TrackerStatus {
  catalogCount: number;
  watchlistCount: number;
  lastSync: Record<string, string>;
  lastAttempt: Record<string, string>;
  providers: Record<string, CatalogSyncStatus>;
  intervalHours: number;
}
