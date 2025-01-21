/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pushFormData, formType } from "@/service";
import { FormMunicipio } from "./form-municipio";
import { FormRegiao } from "./form-regiao";
import { FormUF } from "./form-uf";
import { FormAno } from "./form-ano";
import { FormOptions } from "./form-options";
import { setFormData } from "@/lib/utils";

export const FormNotasFiscais = () => {
  const [selectedOption, setSelectedOption] = useState("todos");
  const queryClient = useQueryClient();

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
