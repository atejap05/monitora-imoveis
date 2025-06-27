import { useConsultasState } from "@/state/consultasState";

// Hook de compatibilidade para manter a API anterior
export function useConsultasZustandCompat() {
  // Zustand store hooks
  const {
    formData,
    submittedFormData,
    consulta,
    isLoading,
    error,
    setFormData,
    submitConsulta,
    setConsulta,
    setLoading,
    setError,
  } = useConsultasState();

  return {
    consulta,
    formData,
    isPending: isLoading,
    error,
    submitConsulta: (ni: string, anos: string[]) =>
      submitConsulta({ ni, anos }),
    setFormData,
    submittedFormData,
    setConsulta,
    setLoading,
    setError,
  };
}

export { useConsultasZustandCompat as useConsultasState };
