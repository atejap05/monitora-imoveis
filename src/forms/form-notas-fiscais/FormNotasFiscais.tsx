/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pushFormData, formType } from "@/service";
import { FormMunicipio } from "./form-municipio";
import { FormRegiao } from "./form-regiao";
import { FormUF } from "./form-uf";
import { FormAno } from "./form-ano";
import { FormOptions } from "./form-options";
import { setFormData } from "@/lib/utils";

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

  console.log(data);
  return data;
};

export const FormNotasFiscais = () => {
  const [selectedOption, setSelectedOption] = useState("todos");
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ["totais-notas-fiscais"],
    queryFn: () => fetchNotasFiscais("todos", [2022, 2023], null, null, null),
  });

  const { mutateAsync: pushFormDataMutation } = useMutation<
    formType<any>,
    unknown,
    formType<any>
  >({
    mutationFn: pushFormData,
    onSuccess: () => {
      alert("Dados enviados com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["contribuintes"],
      });
    },
  });

  if (isPending) {
    return <div>Carregando...</div>;
  }

  if (data) {
    console.log(data);
  }
  async function onSubmit(data: any) {
    const FormData = setFormData(data, selectedOption);

    console.log(JSON.stringify(FormData, null, 2));
    try {
      const res = await pushFormDataMutation(FormData);
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
