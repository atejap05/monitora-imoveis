import { create } from "zustand";
import { TContribuintesData, TContribuintesFilter } from "@/@types";

type ContribuintesFiltersState = {
  filters: TContribuintesFilter;
  submittedFilters: TContribuintesFilter | null;
  isLoading: boolean;
  data: TContribuintesData | null;
  error: Error | null;
  setFilters: (filters: Partial<TContribuintesFilter>) => void;
  submitFilters: (filters: TContribuintesFilter) => void;
  setLoading: (isLoading: boolean) => void;
  setData: (data: TContribuintesData | null) => void;
  setError: (error: Error | null) => void;
};

const initialState: TContribuintesFilter = {
  filtro: "todos",
  anos: [],
  contribuintes: [1, 2, 3], // MEI, ME/EPP, Não Optante
  valorMin: null,
  valorMax: null,
  uf: null,
  municipio: null,
  regiao: null,
};

export const useContribuintesFiltersState = create<ContribuintesFiltersState>(
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
    setData: data => set({ data, isLoading: false }), // Atualiza os dados e desativa o loading
    setError: error => set({ error, isLoading: false }), // Define o erro e desativa o loading
  })
);
