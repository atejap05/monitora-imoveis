/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FormMunicipio } from "./form-municipio";
import { FormRegiao } from "./form-regiao";
import { FormUF } from "./form-uf";
import { FormAno } from "./form-ano";
import { FormOptions } from "./form-options";
import { setFormData, STALE_TIME, YEARS } from "@/lib/utils";
import type {
  TConsultaNFSeTotais,
  TFormData,
  TConsultaNFSeTotaisMeiAmbiente,
} from "@/@types";
import { useNotasFiscaisState } from "@/state/notasFiscaisState";
import { fetchNotasFiscais, fetchNotasFiscaisMeiAmbiente } from "@/service";

export const FormVisaoGeral = () => {
  const [selectedOption, setSelectedOption] = useState("todos");
  const {
    setConsultaNFSeTotais,
    setConsultaNFSeTotaisIsPending,
    setSubmitedNFSeFormData,
    setConsultaNFSeTotaisMeiAmbiente,
    setConsultaMeiAmbienteIsPending,
  } = useNotasFiscaisState();
  const [selectedMunicipio, setSelectedMunicipio] = useState<string | null>(
    null
  );

  const { data: dataNFSeTotois, isPending: isPendingDataNFSeTotais } = useQuery(
    {
      queryKey: ["totais-notas-fiscais"],
      queryFn: () => {
        setSubmitedNFSeFormData({
          filtro: "todos",
          anos: YEARS,
          regiao: null,
          municipio: null,
          uf: null,
        });
        return fetchNotasFiscais({
          filtro: "todos",
          anos: YEARS,
          regiao: null,
          municipio: null,
          uf: null,
        });
      },
      staleTime: STALE_TIME,
    }
  );

  const { data: dataMeiAmbiente, isPending: isPendingMeiAmbiente } = useQuery({
    queryKey: ["totais-notas-fiscais-mei-ambiente"],
    queryFn: () => {
      setSubmitedNFSeFormData({
        filtro: "todos",
        anos: YEARS,
        regiao: null,
        municipio: null,
        uf: null,
      });
      return fetchNotasFiscaisMeiAmbiente({
        filtro: "todos",
        anos: YEARS,
        regiao: null,
        municipio: null,
        uf: null,
      });
    },
    staleTime: STALE_TIME,
  });

  const { mutateAsync, isPending: isPendingMutation } = useMutation<
    TConsultaNFSeTotais,
    unknown,
    TFormData
  >({
    mutationFn: (formData: TFormData) => {
      const { filtro, anos, regiao, municipio, uf } = formData;
      return fetchNotasFiscais({ filtro, anos, regiao, municipio, uf });
    },
    onSuccess: data => {
      setConsultaNFSeTotais(data);
    },
  });

  const {
    mutateAsync: mutateAsyncMeiAmbiente,
    isPending: isPendingMeiAmbienteMutation,
  } = useMutation<TConsultaNFSeTotaisMeiAmbiente, unknown, TFormData>({
    mutationFn: (formData: TFormData) => {
      const { filtro, anos, regiao, municipio, uf } = formData;
      return fetchNotasFiscaisMeiAmbiente({
        filtro,
        anos,
        regiao,
        municipio,
        uf,
      });
    },
    onSuccess: data => {
      setConsultaNFSeTotaisMeiAmbiente(data);
    },
  });

  useEffect(() => {
    setConsultaNFSeTotaisIsPending(
      isPendingDataNFSeTotais || isPendingMutation
    );
    setConsultaMeiAmbienteIsPending(
      isPendingMeiAmbiente || isPendingMeiAmbienteMutation
    );
  }, [
    isPendingDataNFSeTotais,
    isPendingMutation,
    isPendingMeiAmbiente,
    isPendingMeiAmbienteMutation,
  ]);

  useEffect(() => {
    if (dataMeiAmbiente) setConsultaNFSeTotaisMeiAmbiente(dataMeiAmbiente);
    if (dataNFSeTotois) setConsultaNFSeTotais(dataNFSeTotois);
  }, [dataMeiAmbiente, dataNFSeTotois]);

  async function onSubmit(data: any) {
    const FormData = setFormData(data, selectedOption);

    setSubmitedNFSeFormData({
      filtro: selectedOption,
      anos: FormData.anos,
      regiao: FormData.regiao,
      municipio: selectedMunicipio,
      uf: FormData.uf,
    });
    // Call both mutations concurrently
    await Promise.all([
      mutateAsync(FormData),
      mutateAsyncMeiAmbiente(FormData),
    ]);
  }

  return (
    <>
      <FormOptions
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
      <Separator />
      <div className="mt-4">
        {selectedOption === "uf" && (
          <FormUF
            isFormPending={isPendingDataNFSeTotais || isPendingMutation}
            onSubmit={onSubmit}
          />
        )}
        {selectedOption === "municipio" && (
          <FormMunicipio
            isFormPending={isPendingDataNFSeTotais || isPendingMutation}
            onSubmit={onSubmit}
            getSelectedMunicipio={setSelectedMunicipio}
          />
        )}
        {selectedOption === "regiao" && (
          <FormRegiao
            isFormPending={isPendingDataNFSeTotais || isPendingMutation}
            onSubmit={onSubmit}
          />
        )}
        {selectedOption === "todos" && (
          <FormAno
            isFormPending={isPendingDataNFSeTotais || isPendingMutation}
            onSubmit={onSubmit}
          />
        )}
      </div>
    </>
  );
};
