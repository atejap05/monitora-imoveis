import { create } from "zustand";

interface ConveniosFiltersState {
  globalFilter: string;
  regiaoGeografica: string | null;
  regiaoFiscal: string | null;
  status: string | null;
  uf: string | null;
  setGlobalFilter: (value: string) => void;
  setRegiaoGeografica: (value: string | null) => void;
  setRegiaoFiscal: (value: string | null) => void;
  setStatus: (value: string | null) => void;
  setUf: (value: string | null) => void;
  // Filtros avançados podem ser adicionados futuramente
  // uf?: string;
  // municipio?: string;
  // regiao?: string;
  // setUf?: (uf: string) => void;
  // setMunicipio?: (municipio: string) => void;
  // setRegiao?: (regiao: string) => void;
}

export const useConveniosFiltersState = create<ConveniosFiltersState>(set => ({
  globalFilter: "",
  regiaoGeografica: null,
  regiaoFiscal: null,
  status: null,
  uf: null,
  setGlobalFilter: (value: string) => set({ globalFilter: value }),
  setRegiaoGeografica: (value: string | null) => set({ regiaoGeografica: value }),
  setRegiaoFiscal: (value: string | null) => set({ regiaoFiscal: value }),
  setStatus: (value: string | null) => set({ status: value }),
  setUf: (value: string | null) => set({ uf: value }),
  // setUf: (uf: string) => set({ uf }),
  // setMunicipio: (municipio: string) => set({ municipio }),
  // setRegiao: (regiao: string) => set({ regiao }),
})); 