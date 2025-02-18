import { create } from "zustand";
import type {
  TConsultaNFSeTotais,
  TConsultaNFSeTotaisMeiAmbiente,
} from "@/@types";

type SubmitedNFSeFormData = {
  filtro: string | null;
  anos: Array<number | string>;
  regiao: string | null;
  municipio: string | null;
  uf: string | null;
};

type NotasFiscaisState = {
  consultaNFSeTotais: TConsultaNFSeTotais;
  consultaNFSeTotaisIsPending: boolean;

  consutaNFSeTotaisMeiAmbiente: TConsultaNFSeTotaisMeiAmbiente;
  consultaMeiAmbienteIsPending: boolean;

  submitedNFSeFormData: SubmitedNFSeFormData;
  setConsultaNFSeTotais: (data: TConsultaNFSeTotais) => void;
  setConsultaNFSeTotaisIsPending: (status: boolean) => void;

  setConsultaNFSeTotaisMeiAmbiente: (
    data: TConsultaNFSeTotaisMeiAmbiente
  ) => void;
  setConsultaMeiAmbienteIsPending: (status: boolean) => void;

  setSubmitedNFSeFormData: (data: SubmitedNFSeFormData) => void;
};

export const useNotasFiscaisState = create<NotasFiscaisState>(set => ({
  consultaNFSeTotais: {},
  consultaNFSeTotaisIsPending: false,

  consutaNFSeTotaisMeiAmbiente: [],
  consultaMeiAmbienteIsPending: false,

  submitedNFSeFormData: {
    filtro: null,
    anos: [],
    regiao: null,
    municipio: null,
    uf: null,
  },
  setConsultaNFSeTotais: data => set({ consultaNFSeTotais: data }),
  setConsultaNFSeTotaisIsPending: status =>
    set({ consultaNFSeTotaisIsPending: status }),

  setConsultaNFSeTotaisMeiAmbiente: data =>
    set({ consutaNFSeTotaisMeiAmbiente: data }),
  setConsultaMeiAmbienteIsPending: status =>
    set({ consultaMeiAmbienteIsPending: status }),

  setSubmitedNFSeFormData: data => set({ submitedNFSeFormData: data }),
}));
