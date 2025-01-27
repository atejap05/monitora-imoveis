/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormMunicipio } from "./form-municipio";
import { FormRegiao } from "./form-regiao";
import { FormUF } from "./form-uf";
import { FormAno } from "./form-ano";
import { FormOptions } from "./form-options";
import { setFormData, years } from "@/lib/utils";
import type { TConsultaNFSeTotais, TFormData } from "@/@types";
import { useNotasFiscaisState } from "@/state/notasFiscaisState";
import { fetchNotasFiscais } from "@/service";

export const FormNotasFiscais = () => {
  const [selectedOption, setSelectedOption] = useState("todos");
  const { setConsultaNFSeTotais, setConsultaNFSeTotaisIsPending } =
    useNotasFiscaisState();
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery({
    queryKey: ["totais-notas-fiscais"],
    queryFn: () => fetchNotasFiscais("todos", years, null, null, null), // TODO: by default, fetch all data for all years
    refetchOnWindowFocus: false,
  });

  const { mutateAsync, isPending: isPendingMutation } = useMutation<
    TConsultaNFSeTotais,
    unknown,
    TFormData
  >({
    mutationFn: (formData: TFormData) => {
      const { filtro, ano, regiao, municipio, uf } = formData;
      return fetchNotasFiscais(filtro, ano, regiao, municipio, uf);
    },
    onSuccess: data => {
      setConsultaNFSeTotais(data);

      queryClient.invalidateQueries({
        queryKey: ["totais-notas-fiscais"],
      });
    },
  });

  useEffect(() => {
    setConsultaNFSeTotaisIsPending(isPending);
    if (data) setConsultaNFSeTotais(data);
  }, []);

  useEffect(() => {
    setConsultaNFSeTotaisIsPending(isPendingMutation);
  }, [isPendingMutation]);

  async function onSubmit(data: any) {
    const FormData = setFormData(data, selectedOption);
    await mutateAsync(FormData);
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
            isFormPending={isPending || isPendingMutation}
            onSubmit={onSubmit}
          />
        )}
        {selectedOption === "municipio" && (
          <FormMunicipio
            isFormPending={isPending || isPendingMutation}
            onSubmit={onSubmit}
          />
        )}
        {selectedOption === "regiao" && (
          <FormRegiao
            isFormPending={isPending || isPendingMutation}
            onSubmit={onSubmit}
          />
        )}
        {selectedOption === "todos" && (
          <FormAno
            isFormPending={isPending || isPendingMutation}
            onSubmit={onSubmit}
          />
        )}
      </div>
    </>
  );
};
