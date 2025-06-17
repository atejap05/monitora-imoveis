import { useQuery } from "@tanstack/react-query";
import { useNotasFiscaisState } from "@/state/notasFiscaisState"; // Placeholder, ideally replace with actual API call

// Placeholder for your actual API fetching function
// Replace this with your actual data fetching logic, e.g., using axios or fetch
const fetchVisaoGeralDataAPI = async () => {
  // This is a placeholder. In a real scenario, you would make an API call.
  // For now, we'll simulate fetching the data that was previously in Zustand.
  // You'll need to adapt this to your actual API endpoint and service.
  console.warn(
    "fetchVisaoGeralDataAPI is using placeholder data from Zustand. Replace with actual API call."
  );
  const { consultaNFSeTotais } = useNotasFiscaisState.getState(); // Accessing state directly for simulation
  return consultaNFSeTotais;
};

const calcularTotaisGerais = (data: any) => {
  if (!data) {
    return {
      total: 0,
      mei: 0,
      me_epp: 0,
      nao_optante: 0,
    };
  }

  let total = 0;
  let mei = 0;
  let me_epp = 0;
  let nao_optante = 0;

  // Assuming data is an object where keys are years
  // and values are objects with total, mei, me_epp, nao_optante
  for (const ano in data) {
    if (data.hasOwnProperty(ano)) {
      total += data[ano].total || 0;
      mei += data[ano].mei || 0;
      me_epp += data[ano].me_epp || 0;
      nao_optante += data[ano].nao_optante || 0;
    }
  }

  return {
    total,
    mei,
    me_epp,
    nao_optante,
  };
};

export const useVisaoGeralData = () => {
  const {
    data: consultaNFSeTotais,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["visaoGeralData"],
    queryFn: fetchVisaoGeralDataAPI,
  });

  const totaisGerais = calcularTotaisGerais(consultaNFSeTotais);

  // You might want to fetch other specific data for VisaoGeral here as well
  // For example, data for the distribution frequency table, cancellation data, etc.
  // Each could be a separate useQuery call or part of a larger query.

  // Placeholder for distribution frequency data
  const distFreqData = [
    {
      faixa: "0-500",
      frequencia: 1000,
      frequencia_acumulada: 1000,
      frequencia_acumulada_percentual: "10%",
      frequencia_relativa_percentual: "10%",
    },
    {
      faixa: "501-1000",
      frequencia: 500,
      frequencia_acumulada: 1500,
      frequencia_acumulada_percentual: "15%",
      frequencia_relativa_percentual: "5%",
    },
    // ... more data
  ];

  return {
    consultaNFSeTotais,
    totaisGerais,
    distFreqData, // Example of returning more data
    isLoading,
    error,
  };
};
