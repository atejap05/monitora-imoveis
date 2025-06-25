import { create } from "zustand";
import { TVisaoGeral, TFilter } from "@/@types";

type VisaoGeralFiltersState = {
  filters: TFilter;
  submittedFilters: TFilter | null;
  isLoading: boolean;
  data: TVisaoGeral | null;
  error: Error | null;
  setFilters: (filters: Partial<TFilter>) => void;
  submitFilters: (filters: TFilter) => void;
  setLoading: (isLoading: boolean) => void;
  setData: (data: TVisaoGeral | null) => void;
  setError: (error: Error | null) => void;
};

const initialState: TFilter = {
  filtro: "todos",
  anos: [],
  contribuintes: [1, 2, 3],
  valorMin: null,
  valorMax: null,
  uf: null,
  municipio: null,
  regiao: null,
};

export const useVisaoGeralFiltersState = create<VisaoGeralFiltersState>(
  set => ({
    filters: initialState,
    submittedFilters: null,
    isLoading: false,
    data: null,
    error: null,
    setFilters: newFilters =>
      set(state => ({ filters: { ...state.filters, ...newFilters } })),
    submitFilters: filters => set({ submittedFilters: filters, error: null }), // Limpa o erro ao submeter
    setLoading: isLoading => set({ isLoading }),
    setData: data => set({ data }),
    setError: error => set({ error }),
  })
);
