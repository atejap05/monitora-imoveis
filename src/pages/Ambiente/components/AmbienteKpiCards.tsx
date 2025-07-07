import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

interface AmbienteKpiCardsProps {
  adocaoNacional: number;
  principalMeioNome: string;
  pctTranscrita: number;
}

export const AmbienteKpiCards: React.FC<AmbienteKpiCardsProps> = ({
  adocaoNacional,
  principalMeioNome,
  pctTranscrita,
}) => (
  <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* Card 1: Adoção do Ambiente Nacional */}
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-green">
          Adoção do Ambiente Nacional
        </CardTitle>
        <CardDescription>
          Proporção de notas emitidas diretamente no ambiente nacional
        </CardDescription>
      </CardHeader>
      <CardContent>
        <span className="text-3xl font-bold text-green-700">
          {adocaoNacional.toFixed(1)}%
        </span>
      </CardContent>
    </Card>
    {/* Card 2: Principal Meio de Emissão */}
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-green">
          Principal Meio de Emissão
        </CardTitle>
        <CardDescription>
          Canal mais utilizado para emissão de NFSe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-bold text-blue-700">
          {principalMeioNome}
        </span>
      </CardContent>
    </Card>
    {/* Card 3: % de Notas Transcritas */}
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-green">
          % de Notas Transcritas
        </CardTitle>
        <CardDescription>
          Notas emitidas em sistemas legados e transcritas para o padrão
          nacional
        </CardDescription>
      </CardHeader>
      <CardContent>
        <span className="text-3xl font-bold text-yellow-700">
          {pctTranscrita.toFixed(1)}%
        </span>
      </CardContent>
    </Card>
  </div>
);
