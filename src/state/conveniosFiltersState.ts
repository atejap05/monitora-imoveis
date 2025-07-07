import { create } from "zustand";

interface ConveniosFiltersState {
  globalFilter: string;
  regiaoGeografica: string | null;
  regiaoFiscal: string | null;
  status: string | null;
  uf: string | null;
  progress: number;
  setGlobalFilter: (value: string) => void;
  setRegiaoGeografica: (value: string | null) => void;
  setRegiaoFiscal: (value: string | null) => void;
  setStatus: (value: string | null) => void;
  setUf: (value: string | null) => void;
  setProgress: (value: number) => void;
}

export const useConveniosFiltersState = create<ConveniosFiltersState>(set => ({
  globalFilter: "",
  regiaoGeografica: null,
  regiaoFiscal: null,
  status: null,
  uf: null,
  progress: 0,
  setGlobalFilter: value => set({ globalFilter: value }),
  setRegiaoGeografica: value => set({ regiaoGeografica: value }),
  setRegiaoFiscal: value => set({ regiaoFiscal: value }),
  setStatus: value => set({ status: value }),
  setUf: value => set({ uf: value }),
  setProgress: value => set({ progress: value }),
}));
