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

const fetchNotasFiscais = async (
  filtro: string | null,
  anos: Array<number | string>,
  regiao: string | null,
  municipio: string | null,
  uf: string | null
) => {
  const url = `https://localhost:8443/ctx/once/PainelNFSe/get_totais_nfse_com_filtro?filtro=${filtro}&anos=${anos.join(
    ","
  )}&regiao=${regiao}&municipio=${municipio}&uf=${uf}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Erro ao buscar notas fiscais");
  }
  return await response.json();
};

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

  const { mutateAsync, isPending: isPandingMutation } = useMutation<
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
    setConsultaNFSeTotaisIsPending(isPending || isPandingMutation);
    if (data) setConsultaNFSeTotais(data);
  }, [data, isPending, isPandingMutation]);

  async function onSubmit(data: any) {
    const FormData = setFormData(data, selectedOption);
    await mutateAsync(FormData);
  }

  return (
    <div>
      <FormOptions
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
      <Separator />
      <div className="mt-4">
        {selectedOption === "uf" && (
          <FormUF
            isPending={isPending || isPandingMutation}
            onSubmit={onSubmit}
          />
        )}
        {selectedOption === "municipio" && (
          <FormMunicipio
            isPending={isPending || isPandingMutation}
            onSubmit={onSubmit}
          />
        )}
        {selectedOption === "regiao" && (
          <FormRegiao
            isPending={isPending || isPandingMutation}
            onSubmit={onSubmit}
          />
        )}
        {selectedOption === "todos" && (
          <FormAno
            isPending={isPending || isPandingMutation}
            onSubmit={onSubmit}
          />
        )}
      </div>
    </div>
  );
};
