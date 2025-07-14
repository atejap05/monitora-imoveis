import { useEffect, useState } from "react";
import * as topojson from "topojson-client";
import type { FeatureCollection, Feature, Geometry } from "geojson";

interface BrazilTopology {
  type: "Topology";
  objects: {
    estados: {
      type: "GeometryCollection";
      geometries: Array<{
        type: "Polygon";
        properties: { nome: string };
        id: string;
        arcs: number[][];
      }>;
    };
  };
  arcs: number[][][];
  transform: {
    scale: [number, number];
    translate: [number, number];
  };
}

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
 * @param url - URL do arquivo TopoJSON (padrão: /maps/br-states.json)
 * @returns Objeto com dados GeoJSON, estado de loading e erro
 */
export function useGeoJson(
  url: string = "/maps/br-states.json"
): UseGeoJsonReturn {
  const [data, setData] = useState<StateFeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchGeoJson = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Erro ao carregar dados geográficos: ${response.status}`
          );
        }

        const topologyData: BrazilTopology = await response.json();

        // Converte TopoJSON para GeoJSON
        const geoJsonData = topojson.feature(
          topologyData,
          topologyData.objects.estados
        ) as StateFeatureCollection;

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

        if (isMounted) {
          setData(geoJsonData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Erro desconhecido");
          console.error("Erro ao carregar dados geográficos:", err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchGeoJson();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, isLoading, error };
}
