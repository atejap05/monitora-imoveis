import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Users, MapPin, PieChart, Filter } from "lucide-react";

export const ContribuintesWelcome: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            <div className="text-center space-y-4">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-green rounded-full">
                        <Users className="h-16 w-16 text-white" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">
                    Análise de Contribuintes
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Visualize o perfil, a distribuição e o comportamento dos
                    contribuintes na sua base de dados.
                </p>
            </div>

            {/* Cards com Recursos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
                <Card className="text-center border-green-200 hover:border-green-300 transition-colors">
                    <CardHeader className="pb-3">
                        <div className="flex justify-center mb-2">
                            <PieChart className="h-8 w-8 text-blue-600" />
                        </div>
                        <CardTitle className="text-sm font-medium text-gray-700">
                            KPIs de Contribuintes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-xs">
                            Métricas detalhadas por tipo e faturamento
                        </CardDescription>
                    </CardContent>
                </Card>

                <Card className="text-center border-green-200 hover:border-green-300 transition-colors">
                    <CardHeader className="pb-3">
                        <div className="flex justify-center mb-2">
                            <MapPin className="h-8 w-8 text-yellow-600" />
                        </div>
                        <CardTitle className="text-sm font-medium text-gray-700">
                            Análise Geográfica
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-xs">
                            Mapas e gráficos por UF e município
                        </CardDescription>
                    </CardContent>
                </Card>

                <Card className="text-center border-green-200 hover:border-green-300 transition-colors">
                    <CardHeader className="pb-3">
                        <div className="flex justify-center mb-2">
                            <Users className="h-8 w-8 text-purple-600" />
                        </div>
                        <CardTitle className="text-sm font-medium text-gray-700">
                            Perfil Tributário
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-xs">
                            Análise por MEI, ME/EPP e Não Optantes
                        </CardDescription>
                    </CardContent>
                </Card>

                <Card className="text-center border-green-200 hover:border-green-300 transition-colors">
                    <CardHeader className="pb-3">
                        <div className="flex justify-center mb-2">
                            <Filter className="h-8 w-8 text-green-600" />
                        </div>
                        <CardTitle className="text-sm font-medium text-gray-700">
                            Análise Detalhada
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-xs">
                            Filtros por período, região e valor
                        </CardDescription>
                    </CardContent>
                </Card>
            </div>

            {/* Nota Informativa */}
            <div className="text-center max-w-lg">
                <p className="text-md text-gray-600">
                    💡 <strong>Para começar:</strong> Use os filtros na barra lateral para
                    personalizar sua análise e visualizar o dashboard de contribuintes.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Aplique filtros por período, região, município ou tipo de contribuinte
                    para obter insights específicos.
                </p>
            </div>
        </div>
    );
}; 