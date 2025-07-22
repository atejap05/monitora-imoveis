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
    submitFilters: filters => {
      set({
        submittedFilters: filters,
        error: null,
        data: null, // Limpa dados existentes para garantir que o skeleton apareça
        isLoading: true, // Ativa o loading imediatamente
      });
    },
    setLoading: isLoading => set({ isLoading }),
    setData: data => set({ data, isLoading: false }), // Atualiza os dados e desativa o loading
    setError: error => {
      if (error) {
        // Só desativa loading se há um erro real
        set({ error, isLoading: false });
      } else {
        // Se está limpando o erro (null), não mexe no loading
        set({ error: null });
      }
    },
  })
);
