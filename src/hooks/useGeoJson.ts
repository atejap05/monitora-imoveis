import { useEffect, useState } from "react";
import * as topojson from "topojson-client";
import type { FeatureCollection, Feature, Geometry } from "geojson";
import brStatesData from "../assets/maps/br-states.json";

interface StateProperties {
  nome: string;
  id: string;
}

type StateFeature = Feature<Geometry, StateProperties>;
type StateFeatureCollection = FeatureCollection<Geometry, StateProperties>;

interface UseGeoJsonReturn {
  data: StateFeatureCollection | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook para carregar e converter dados TopoJSON dos estados brasileiros
 * @returns Objeto com dados GeoJSON, estado de loading e erro
 */
export function useGeoJson(): UseGeoJsonReturn {
  const [data, setData] = useState<StateFeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setIsLoading(true);
      setError(null);

      // Converte TopoJSON para GeoJSON
      const geoJsonData = topojson.feature(
        brStatesData as any,
        (brStatesData as any).objects.estados
      ) as unknown as StateFeatureCollection;

      // Adiciona o ID como propriedade para facilitar o mapeamento
      geoJsonData.features = geoJsonData.features.map(
        (feature: StateFeature) => ({
          ...feature,
          properties: {
            ...feature.properties,
            id: feature.id as string,
          },
        })
      );

      setData(geoJsonData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      console.error("Erro ao processar dados geográficos:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error };
}
