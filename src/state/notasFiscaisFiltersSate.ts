import { create } from "zustand";
import { TFilter } from "@/@types";

interface NotasFiscaisFiltersState {
  filters: TFilter;
  submittedFilters: TFilter | null;
  isLoading: boolean;
  error: Error | null;
  setFilters: (filters: Partial<TFilter>) => void;
  submitFilters: (filters: TFilter) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
}

// Valores padrão para os filtros de notas fiscais
const defaultFilters: TFilter = {
  filtro: "uf",
  anos: [],
  contribuintes: [],
  valorMin: null,
  valorMax: null,
  uf: null,
  municipio: null,
  regiao: null,
};

export const useNotasFiscaisFiltersState = create<NotasFiscaisFiltersState>(
  set => ({
    filters: defaultFilters,
    submittedFilters: null,
    isLoading: false,
    error: null,
    setFilters: (filters: Partial<TFilter>) =>
      set(state => ({ filters: { ...state.filters, ...filters } })),
    submitFilters: (filters: TFilter) =>
      set({ submittedFilters: filters, error: null }),
    setLoading: (isLoading: boolean) => set({ isLoading }),
    setError: (error: Error | null) => set({ error }),
  })
);
