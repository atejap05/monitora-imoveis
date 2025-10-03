import { Activity } from "lucide-react";

export const VolumetriaWelcome = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <Activity className="w-20 h-20 text-blue-500 mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Análise de Volumetria NFSe
            </h2>
            <p className="text-gray-600 max-w-2xl mb-6">
                Esta seção apresenta análises temporais completas dos padrões de
                processamento de NFSe para planejamento de infraestrutura.
            </p>
            <p className="text-gray-500 text-sm">
                Os dados serão carregados automaticamente.
            </p>
        </div>
    );
};

