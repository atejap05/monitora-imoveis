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
    selectedMunicipio,
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
            {/* Renderiza resultado bruto para debug */}
            <DebugNFSeResponse />
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

// Componente para debug visual da resposta do servidor
const DebugNFSeResponse = () => {
  const { nfseTotaisData, meiAmbienteData } = useVisaoGeralFilters();
  return (
    <div
      style={{
        marginTop: 16,
        background: "#f8f8f8",
        padding: 8,
        borderRadius: 4,
      }}
    >
      <div>
        <b>nfseTotaisData:</b>
      </div>
      <pre style={{ fontSize: 12, color: "#333" }}>
        {JSON.stringify(nfseTotaisData, null, 2)}
      </pre>
      <div>
        <b>meiAmbienteData:</b>
      </div>
      <pre style={{ fontSize: 12, color: "#333" }}>
        {JSON.stringify(meiAmbienteData, null, 2)}
      </pre>
    </div>
  );
};
