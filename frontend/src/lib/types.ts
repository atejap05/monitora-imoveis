export type PropertyStatus = "active" | "inactive" | "price_drop" | "price_up";

/** Status persistido no banco (PATCH / exibição no formulário). */
export type ListingStatus = "active" | "inactive" | "error";

export interface PropertyHistory {
  price: number;
  date: string;
  status: PropertyStatus;
}

export interface Property {
  id: number;
  url: string;
  title: string;
  price: number;
  previousPrice: number | null;
  bedrooms: number;
  bathrooms: number;
  suites: number;
  size: string;
  parkingSpots: number;
  address: string;
  neighborhood: string;
  city: string;
  type: "sale" | "rent";
  status: PropertyStatus;
  listingStatus: ListingStatus;
  source: string;
  imageUrl: string;
  comment: string;
  favorite: boolean;
  condoFee?: number | null;
  iptu?: number | null;
  description?: string | null;
  referenceCode?: string | null;
  createdAt: string;
  updatedAt: string;
  history: PropertyHistory[];
}

/** Payload for PATCH /api/properties/:id (camelCase). */
export type PropertyUpdatePayload = {
  neighborhood?: string;
  price?: number;
  comment?: string | null;
  favorite?: boolean;
  status?: "active" | "inactive" | "error";
};

/** Resposta de POST /api/properties/rescrape */
export interface RescrapeResultItem {
  id: number;
  status: string;
  detail?: string;
  oldPrice?: number | null;
  newPrice?: number | null;
}

export interface RescrapeBatchResult {
  total: number;
  updated: number;
  priceChanges: number;
  errors: number;
  inactiveListings: number;
  results: RescrapeResultItem[];
}

/** GET /api/jobs/status */
export interface JobStatus {
  lastRunAt: string | null;
  nextRunAt: string | null;
  intervalHours: number;
  propertiesChecked: number;
  priceChanges: number;
  errors: number;
  inactiveListings: number;
}
