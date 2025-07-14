import type {
  TContribuintesFilter,
  TTipoContribuinteResponsavel,
  TMunicipioMapa,
} from "@/@types";

/**
 * Busca dados consolidados da página Contribuintes
 */
// export const fetchContribuintesData = async (
//   params: TContribuintesFilter
// ): Promise<TContribuintesData> => {
//   const win = window as Window & {
//     runScript?: (
//       scriptName: string,
//       functionName: string,
//       params: TContribuintesFilter
//     ) => Promise<TContribuintesData>;
//   };

//   const response = await win.runScript!(
//     "",
//     "get_contribuintes_dashboard_data",
//     params
//   );

//   return response as TContribuintesData;
// };

/**
 * Busca dados específicos para o mapa de contribuintes
 * Retorna dados agregados por município conforme a query fornecida
 */
export const fetchMapData = async (
  params: TContribuintesFilter
): Promise<TMunicipioMapa[]> => {
  const win = window as Window & {
    runScript?: (
      scriptName: string,
      functionName: string,
      params: TContribuintesFilter
    ) => Promise<TMunicipioMapa[]>;
  };

  const response = await win.runScript!("", "get_map_data", params);

  console.log("mapData", response);

  return response as TMunicipioMapa[];
};

// /**
//  * Busca KPIs principais dos contribuintes
//  */
// export const fetchContribuintesKpi = async (
//   params: TContribuintesFilter
// ): Promise<TContribuintesKpi> => {
//   const win = window as Window & {
//     runScript?: (
//       scriptName: string,
//       functionName: string,
//       params: TContribuintesFilter
//     ) => Promise<TContribuintesKpi>;
//   };

//   const response = await win.runScript!("", "get_contribuintes_kpi", params);

//   return response as TContribuintesKpi;
// };

// /**
//  * Busca dados para gráficos da página Contribuintes
//  */
// export const fetchContribuintesCharts = async (
//   params: TContribuintesFilter
// ): Promise<TContribuintesCharts> => {
//   const win = window as Window & {
//     runScript?: (
//       scriptName: string,
//       functionName: string,
//       params: TContribuintesFilter
//     ) => Promise<TContribuintesCharts>;
//   };

//   const response = await win.runScript!(
//     "",
//     "get_contribuintes_charts_data",
//     params
//   );

//   return response as TContribuintesCharts;
// };

// /**
//  * Busca lista paginada de contribuintes
//  */
// export const fetchContribuintesTabela = async (
//   params: TContribuintesFilter & { page?: number; limit?: number }
// ): Promise<{
//   contribuintes: TContribuinte[];
//   total_pages: number;
//   current_page: number;
//   total_items: number;
// }> => {
//   const win = window as Window & {
//     runScript?: (
//       scriptName: string,
//       functionName: string,
//       params: TContribuintesFilter & { page?: number; limit?: number }
//     ) => Promise<{
//       contribuintes: TContribuinte[];
//       total_pages: number;
//       current_page: number;
//       total_items: number;
//     }>;
//   };

//   const response = await win.runScript!("", "get_contribuintes_tabela", params);

//   return response;
// };

/**
 * Busca dados de tipo de contribuinte responsável
 */
export const fetchTipoContribuinteResponsavel = async (
  params: TContribuintesFilter
): Promise<TTipoContribuinteResponsavel[]> => {
  const win = window as Window & {
    runScript?: (
      scriptName: string,
      functionName: string,
      params: TContribuintesFilter
    ) => Promise<TTipoContribuinteResponsavel[]>;
  };

  const response = await win.runScript!(
    "",
    "get_tipo_contribuinte_responsavel",
    params
  );

  console.log("tipoContribuinteResponsavel", response);
  return response as TTipoContribuinteResponsavel[];
};
