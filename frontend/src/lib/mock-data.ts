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

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 1,
    url: "https://www.primeiraporta.com.br/imovel/4109009/apartamento-venda-sao-jose-dos-campos-sp-jardim-das-industrias",
    title: "Apartamento no Jardim das Indústrias",
    price: 1300000,
    previousPrice: 1380000,
    bedrooms: 4,
    bathrooms: 3,
    suites: 3,
    size: "160m²",
    parkingSpots: 2,
    address: "Rua Manoel da Nóbrega, 123",
    neighborhood: "Jardim das Indústrias",
    city: "São José dos Campos - SP",
    type: "sale",
    status: "price_drop",
    source: "Primeira Porta",
    imageUrl: "",
    createdAt: "2026-04-10T10:00:00Z",
    updatedAt: "2026-04-13T14:30:00Z",
    history: [
      { price: 1420000, date: "2026-04-10", status: "active" },
      { price: 1380000, date: "2026-04-11", status: "price_drop" },
      { price: 1300000, date: "2026-04-13", status: "price_drop" },
    ],
  },
  {
    id: 2,
    url: "https://www.primeiraporta.com.br/imovel/4205112/cobertura-venda-sjc",
    title: "Cobertura Duplex Vista Panorâmica",
    price: 2150000,
    previousPrice: 2150000,
    bedrooms: 5,
    bathrooms: 4,
    suites: 3,
    size: "280m²",
    parkingSpots: 3,
    address: "Av. Cassiano Ricardo, 601",
    neighborhood: "Jardim Aquarius",
    city: "São José dos Campos - SP",
    type: "sale",
    status: "active",
    source: "Primeira Porta",
    imageUrl: "",
    createdAt: "2026-04-08T09:00:00Z",
    updatedAt: "2026-04-13T14:30:00Z",
    history: [
      { price: 2150000, date: "2026-04-08", status: "active" },
      { price: 2150000, date: "2026-04-11", status: "active" },
      { price: 2150000, date: "2026-04-13", status: "active" },
    ],
  },
  {
    id: 3,
    url: "https://www.primeiraporta.com.br/imovel/3998776/apartamento-aluguel-sjc",
    title: "Studio Moderno Centro",
    price: 2800,
    previousPrice: 2500,
    bedrooms: 1,
    bathrooms: 1,
    suites: 1,
    size: "45m²",
    parkingSpots: 1,
    address: "Rua Euclides Miragaia, 88",
    neighborhood: "Centro",
    city: "São José dos Campos - SP",
    type: "rent",
    status: "price_up",
    source: "Primeira Porta",
    imageUrl: "",
    createdAt: "2026-04-05T11:20:00Z",
    updatedAt: "2026-04-12T16:00:00Z",
    history: [
      { price: 2500, date: "2026-04-05", status: "active" },
      { price: 2800, date: "2026-04-12", status: "price_up" },
    ],
  },
  {
    id: 4,
    url: "https://www.primeiraporta.com.br/imovel/4300221/casa-venda-sjc",
    title: "Casa Térrea com Piscina",
    price: 890000,
    previousPrice: 890000,
    bedrooms: 3,
    bathrooms: 2,
    suites: 1,
    size: "220m²",
    parkingSpots: 2,
    address: "Rua das Flores, 45",
    neighborhood: "Urbanova",
    city: "São José dos Campos - SP",
    type: "sale",
    status: "inactive",
    source: "Primeira Porta",
    imageUrl: "",
    createdAt: "2026-04-02T08:00:00Z",
    updatedAt: "2026-04-11T10:00:00Z",
    history: [
      { price: 890000, date: "2026-04-02", status: "active" },
      { price: 890000, date: "2026-04-08", status: "active" },
      { price: 890000, date: "2026-04-11", status: "inactive" },
    ],
  },
  {
    id: 5,
    url: "https://www.primeiraporta.com.br/imovel/4401998/apartamento-aluguel-sjc",
    title: "Apartamento Garden Alto Padrão",
    price: 4200,
    previousPrice: 4500,
    bedrooms: 3,
    bathrooms: 2,
    suites: 1,
    size: "120m²",
    parkingSpots: 2,
    address: "Av. Shishima Hifumi, 2911",
    neighborhood: "Urbanova",
    city: "São José dos Campos - SP",
    type: "rent",
    status: "price_drop",
    source: "Primeira Porta",
    imageUrl: "",
    createdAt: "2026-04-07T14:00:00Z",
    updatedAt: "2026-04-13T09:00:00Z",
    history: [
      { price: 4500, date: "2026-04-07", status: "active" },
      { price: 4200, date: "2026-04-13", status: "price_drop" },
    ],
  },
];
