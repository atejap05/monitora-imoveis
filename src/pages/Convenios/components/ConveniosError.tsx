import React from "react";

interface ConveniosErrorProps {
  error: string | null;
}

export const ConveniosError: React.FC<ConveniosErrorProps> = ({ error }) => (
  <div className="text-red-500 text-center">
    Ocorreu um erro ao buscar os dados.
    {error && <pre className="mt-2 text-left whitespace-pre-wrap">{error}</pre>}
  </div>
);
