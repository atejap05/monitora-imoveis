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
  contribuintes: [],
  valorMin: null,
  valorMax: null,
  uf: null,
  municipio: null,
  regiao: null,
};

export const useAmbienteFiltersState = create<AmbienteFiltersState>(set => ({
  filters: defaultFilters,
  submittedFilters: null,
  isLoading: false,
  submitFilters: f => set({ filters: f, submittedFilters: f }),
  setFilters: f => set({ filters: f }),
}));
