export type PropertyStatus = "active" | "inactive" | "price_drop" | "price_up";

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
  source: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  history: PropertyHistory[];
}
