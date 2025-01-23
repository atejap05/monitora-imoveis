/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormMunicipio } from "./form-municipio";
import { FormRegiao } from "./form-regiao";
import { FormUF } from "./form-uf";
import { FormAno } from "./form-ano";
import { FormOptions } from "./form-options";
import { setFormData, years } from "@/lib/utils";
import type { TFormData } from "@/@types";

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
  const data = await response.json();
  return data;
};

export const FormNotasFiscais = () => {
  const [selectedOption, setSelectedOption] = useState("todos");
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ["totais-notas-fiscais"],
    queryFn: () => fetchNotasFiscais("todos", years, null, null, null), // TODO: by default, fetch all data for all years
  });

  const { mutateAsync, isPending: isPandingMutation } = useMutation<
    TFormData,
    unknown,
    TFormData
  >({
    mutationFn: (formData: TFormData) =>
      fetchNotasFiscais(
        formData.filtro,
        formData.ano,
        formData.regiao,
        formData.municipio,
        formData.uf
      ),
    onSuccess: data => {
      console.log(data);
      alert("Dados enviados com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["totais-notas-fiscais"],
      });
    },
  });

  if (isPending || isPandingMutation) {
    return <div>Carregando...</div>;
  }

  async function onSubmit(data: any) {
    const FormData = setFormData(data, selectedOption);

    // console.log(JSON.stringify(FormData, null, 2));
    try {
      const res = await mutateAsync(FormData);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <FormOptions
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
      <Separator />
      <div className="mt-4">
        {selectedOption === "uf" && <FormUF onSubmit={onSubmit} />}
        {selectedOption === "municipio" && (
          <FormMunicipio onSubmit={onSubmit} />
        )}
        {selectedOption === "regiao" && <FormRegiao onSubmit={onSubmit} />}
        {selectedOption === "todos" && <FormAno onSubmit={onSubmit} />}
      </div>
    </div>
  );
};
