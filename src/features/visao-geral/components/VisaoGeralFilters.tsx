/* eslint-disable @typescript-eslint/no-explicit-any */
import { Separator } from "@/components/ui/separator";
import {
  FormMunicipio,
  FormRegiao,
  FormUF,
  FormAno,
  FormOptions,
} from "./filters";
import { useVisaoGeralFilters } from "../hooks/useVisaoGeralFilters";

export const VisaoGeralFilters = () => {
  const {
    selectedOption,
    setSelectedOption,
    setSelectedMunicipio,
    handleSubmitFilters,
    isLoading,
  } = useVisaoGeralFilters();

  return (
    <>
      <FormOptions
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
      <Separator />
      <div className="mt-4">
        {selectedOption === "uf" && (
          <>
            <FormUF isFormPending={isLoading} onSubmit={handleSubmitFilters} />
          </>
        )}
        {selectedOption === "municipio" && (
          <FormMunicipio
            isFormPending={isLoading}
            onSubmit={handleSubmitFilters}
            getSelectedMunicipio={setSelectedMunicipio}
          />
        )}
        {selectedOption === "regiao" && (
          <FormRegiao
            isFormPending={isLoading}
            onSubmit={handleSubmitFilters}
          />
        )}
        {selectedOption === "todos" && (
          <FormAno isFormPending={isLoading} onSubmit={handleSubmitFilters} />
        )}
      </div>
    </>
  );
};
