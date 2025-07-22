import { UseQueryOptions } from "@tanstack/react-query";

/**
 * Configurações específicas para diferentes tipos de queries
 * baseadas na criticidade e características dos dados
 */

// Configuração para dados críticos (KPIs, dashboards principais)
export const criticalQueryConfig: Partial<UseQueryOptions> = {
  retry: 3,
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
  staleTime: 1000 * 60 * 30, // 30 minutos para dados críticos
  gcTime: 1000 * 60 * 60 * 2, // 2 horas
};

// Configuração para dados pesados (mapas, relatórios grandes)
export const heavyDataQueryConfig: Partial<UseQueryOptions> = {
  retry: 2,
  retryDelay: attemptIndex => Math.min(2000 * 2 ** attemptIndex, 30000),
  staleTime: 1000 * 60 * 60 * 2, // 2 horas para dados pesados
  gcTime: 1000 * 60 * 60 * 4, // 4 horas
};

// Configuração para dados auxiliares (municipios IBGE, etc)
export const auxiliaryQueryConfig: Partial<UseQueryOptions> = {
  retry: 1,
  retryDelay: 5000,
  staleTime: 1000 * 60 * 60 * 24, // 24 horas para dados auxiliares
  gcTime: 1000 * 60 * 60 * 48, // 48 horas
};

// Configuração para prefetch (baixa prioridade)
export const prefetchQueryConfig: Partial<UseQueryOptions> = {
  retry: 1,
  retryDelay: 10000,
  staleTime: 1000 * 60 * 60, // 1 hora padrão
  gcTime: 1000 * 60 * 60 * 2, // 2 horas
};

/**
 * Error handlers específicos para diferentes cenários
 */
export const errorHandlers = {
  /**
   * Handler para erros de backend com fila lotada
   */
  queueOverflow: (error: Error) => {
    if (error.message.includes("timeout") || error.message.includes("queue")) {
      console.warn(
        "[Queue] Backend com fila cheia, tentando novamente em breve..."
      );
      return true; // Permitir retry
    }
    return false;
  },

  /**
   * Handler para erros de dados não encontrados
   */
  dataNotFound: (error: Error) => {
    if (
      error.message.includes("404") ||
      error.message.includes("não encontrado")
    ) {
      console.info(
        "[Data] Dados não encontrados para os filtros especificados"
      );
      return false; // Não fazer retry
    }
    return true;
  },

  /**
   * Handler para erros de validação de filtros
   */
  invalidFilters: (error: Error) => {
    if (
      error.message.includes("filtro") ||
      error.message.includes("parâmetro")
    ) {
      console.error("[Validation] Filtros inválidos:", error.message);
      return false; // Não fazer retry
    }
    return true;
  },
};

/**
 * Função para determinar se deve fazer retry baseado no tipo de erro
 */
export const shouldRetryQuery = (
  failureCount: number,
  error: Error
): boolean => {
  // Máximo de 3 tentativas
  if (failureCount >= 3) return false;

  // Verifica handlers específicos
  for (const handler of Object.values(errorHandlers)) {
    if (!handler(error)) return false;
  }

  return true;
};

/**
 * Configuração global otimizada com error handling
 */
export const optimizedQueryConfig = {
  retry: shouldRetryQuery,
  retryDelay: (attemptIndex: number, error: Error) => {
    // Delay maior para erros de fila
    if (error.message.includes("timeout") || error.message.includes("queue")) {
      return Math.min(3000 * 2 ** attemptIndex, 30000);
    }
    // Delay padrão para outros erros
    return Math.min(1000 * 2 ** attemptIndex, 15000);
  },
  staleTime: 1000 * 60 * 60, // 1 hora padrão
  gcTime: 1000 * 60 * 60 * 2, // 2 horas padrão
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};
