import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Map as LeafletMap } from 'leaflet';
import L from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContribuintesFiltersState } from "@/state/contribuintesFiltersState";
import { useGeoJson } from "@/hooks/useGeoJson";
import { MapSkeleton } from "./MapSkeleton";
import { MapPin } from "lucide-react";
import type { Feature } from 'geojson';
import type { PathOptions } from 'leaflet';

interface StateProperties {
    nome: string;
    id: string;
}

type StateFeature = Feature<any, StateProperties>;

export const ContribuintesMapChart = () => {
    const mapRef = useRef<LeafletMap>(null);
    const { data: contribuintesData, isLoading: isLoadingData, submittedFilters } = useContribuintesFiltersState();
    const { data: geoData, isLoading: isLoadingGeo, error: geoError } = useGeoJson();

    // Extrai os dados do mapa dos dados dos contribuintes
    const mapData = contribuintesData?.charts?.mapa_uf || [];

    // Calcula a escala de cores baseada nos dados
    const { minValue, maxValue, getColor } = useMemo(() => {
        // Filtra valores nulos/undefined
        const validValues = mapData.map(item => item.total_contribuintes ?? 0);
        if (!mapData.length || validValues.every(v => v === 0)) {
            return {
                minValue: 0,
                maxValue: 1,
                getColor: () => '#f0f0f0'
            };
        }

        const min = Math.min(...validValues);
        const max = Math.max(...validValues);

        const getColor = (value: number): string => {
            if (!value || value === 0) return '#f0f0f0'; // Cinza claro para estados sem dados
            // Escala de azul: do claro ao escuro
            const intensity = (value - min) / (max - min || 1);
            const blue = Math.round(255 - (intensity * 100)); // 255 a 155
            return `rgb(${blue}, ${blue + 20}, 255)`;
        };

        return { minValue: min, maxValue: max, getColor };
    }, [mapData]);

    // Função para obter dados de um estado específico
    const getStateData = (stateId: string) => {
        return mapData.find(item => item.uf === stateId);
    };

    // Estilo para cada estado
    const getFeatureStyle = (feature?: StateFeature): PathOptions => {
        if (!feature) return { fillColor: '#f0f0f0', weight: 1, opacity: 1, color: '#666', fillOpacity: 0.7 };

        const stateData = getStateData(feature.properties.id);
        const value = stateData?.total_contribuintes || 0;

        return {
            fillColor: getColor(value),
            weight: 1,
            opacity: 1,
            color: '#666',
            fillOpacity: 0.7,
        };
    };

    // Eventos para interatividade
    const onEachFeature = (feature: StateFeature, layer: any) => {
        const stateData = getStateData(feature.properties.id);
        const contribuintes = stateData?.total_contribuintes || 0;
        const totalNfse = stateData?.total_nfse || 0;
        const valorTotal = stateData?.valor_total || 0;

        // Tooltip com informações detalhadas
        layer.bindTooltip(
            `<div style="font-size: 12px;">
                <strong>${feature.properties.nome}</strong><br/>
                <span>Contribuintes: ${contribuintes.toLocaleString()}</span><br/>
                <span>NFSe: ${totalNfse.toLocaleString()}</span><br/>
                <span>Valor Total: R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>`,
            {
                permanent: false,
                direction: 'center',
                className: 'custom-tooltip'
            }
        );

        // Eventos de hover
        layer.on({
            mouseover: (e: any) => {
                const layer = e.target;
                layer.setStyle({
                    weight: 2,
                    color: '#333',
                    fillOpacity: 0.9
                });
                layer.bringToFront();
            },
            mouseout: (e: any) => {
                const layer = e.target;
                layer.setStyle(getFeatureStyle(feature));
            }
        });
    };

    // Zoom automático baseado nos filtros
    useEffect(() => {
        if (!mapRef.current || !geoData || !submittedFilters) return;

        const map = mapRef.current;

        setTimeout(() => {
            if (submittedFilters.filtro === 'uf' && submittedFilters.uf) {
                // Zoom no estado específico
                const targetState = geoData.features.find(
                    feature => feature.properties.id === submittedFilters.uf
                );
                if (targetState && targetState.geometry) {
                    const bounds = L.geoJSON(targetState).getBounds();
                    map.fitBounds(bounds, { padding: [20, 20] });
                }
            } else if (submittedFilters.filtro === 'regiao' && submittedFilters.regiao) {
                // Zoom na região (implementar mapeamento região -> estados)
                // Por enquanto, mantém zoom padrão
                map.setView([-15.7801, -47.9292], 4);
            } else {
                // Zoom padrão do Brasil
                map.setView([-15.7801, -47.9292], 4);
            }
        }, 100);
    }, [geoData, submittedFilters]);

    if (isLoadingGeo || isLoadingData) {
        return <MapSkeleton />;
    }

    if (geoError) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <MapPin size={16} />
                        Erro ao Carregar Mapa
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] flex items-center justify-center bg-red-50 rounded-lg">
                        <p className="text-red-600">{geoError}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!geoData) {
        return <MapSkeleton />;
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-600" />
                    Distribuição de Contribuintes por Estado
                </CardTitle>
                {mapData.length > 0 && (
                    <div className="text-sm text-gray-600">
                        <span>Menor: {minValue.toLocaleString()}</span>
                        <span className="mx-4">•</span>
                        <span>Maior: {maxValue.toLocaleString()}</span>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full rounded-lg overflow-hidden border">
                    <MapContainer
                        ref={mapRef}
                        center={[-15.7801, -47.9292]}
                        zoom={4}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={true}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <GeoJSON
                            data={geoData}
                            style={getFeatureStyle}
                            onEachFeature={onEachFeature}
                        />
                    </MapContainer>
                </div>

                {/* Legenda */}
                {mapData.length > 0 && (
                    <div className="mt-4 flex items-center justify-center">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>Menos contribuintes</span>
                            <div className="flex">
                                {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity, index) => (
                                    <div
                                        key={index}
                                        className="w-4 h-4 border border-gray-300"
                                        style={{
                                            backgroundColor: getColor(minValue + (maxValue - minValue) * intensity)
                                        }}
                                    />
                                ))}
                            </div>
                            <span>Mais contribuintes</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}; 