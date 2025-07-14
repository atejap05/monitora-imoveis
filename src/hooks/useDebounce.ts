import { useEffect, useState } from "react";

/**
 * Hook personalizado para aplicar debounce em valores
 * @param value - O valor a ser "debouncado"
 * @param delay - O delay em milissegundos (padrão: 500ms)
 * @returns O valor após o delay
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura o timer para atualizar o valor após o delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timer se o valor mudar antes do delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
