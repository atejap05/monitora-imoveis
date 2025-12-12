import { create } from "zustand";
import { VolumetriaParams, VolumetriaItem } from "@/@types";

type VolumetriaFiltersState = {
  filters: VolumetriaParams;
  submittedFilters: VolumetriaParams | null;
  isLoading: boolean;
  data: VolumetriaItem[] | null;
  error: Error | null;
  setFilters: (filters: Partial<VolumetriaParams>) => void;
  submitFilters: (filters: VolumetriaParams) => void;
  setLoading: (isLoading: boolean) => void;
  setData: (data: VolumetriaItem[] | null) => void;
  setError: (error: Error | null) => void;
};

const initialState: VolumetriaParams = {
  filtro: "todos",
  anos: [],
  contribuintes: [],
  valorMin: undefined,
  valorMax: undefined,
  uf: undefined,
  municipio: undefined,
  regiao: undefined,
};

export const useVolumetriaFiltersState = create<VolumetriaFiltersState>(
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
        data: null,
        isLoading: true,
      });
    },

    setLoading: isLoading => set({ isLoading }),

    setData: data => set({ data, isLoading: false }),

    setError: error => {
      if (error) {
        set({ error, isLoading: false });
      } else {
        set({ error: null });
      }
    },
  })
);
