import { TFilter } from "@/@types";
import { create } from "zustand";

interface AmbienteFiltersState {
  filters: TFilter;
  isLoading: boolean;
  submitFilters: (f: TFilter) => void;
  setFilters: (f: TFilter) => void;
}

const defaultFilters: TFilter = {
  filtro: "",
  anos: [],
  contribuintes: [],
  valorMin: null,
  valorMax: null,
  uf: null,
  municipio: null,
  regiao: null,
};

export const useAmbienteFiltersState = create<AmbienteFiltersState>(set => ({
  filters: defaultFilters,
  isLoading: false,
  submitFilters: f => set({ filters: f }),
  setFilters: f => set({ filters: f }),
}));
