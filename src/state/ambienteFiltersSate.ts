import { TFilter } from "@/@types";
import { create } from "zustand";

interface AmbienteFiltersState {
  filters: TFilter;
  submittedFilters: TFilter | null;
  isLoading: boolean;
  submitFilters: (f: TFilter) => void;
  setFilters: (f: TFilter) => void;
}

const defaultFilters: TFilter = {
  filtro: "todos",
  anos: [],
  contribuintes: [1, 2, 3],
  valorMin: null,
  valorMax: null,
  uf: null,
  municipio: null,
  regiao: null,
};

export const useAmbienteFiltersState = create<AmbienteFiltersState>(set => ({
  filters: defaultFilters,
  submittedFilters: defaultFilters, // Inicializa igual ao padrão das outras páginas
  isLoading: false,
  submitFilters: f => set({ filters: f, submittedFilters: f }),
  setFilters: f => set({ filters: f }),
}));
