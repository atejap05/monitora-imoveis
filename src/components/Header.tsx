import { formataCPF } from "@/lib/utils";
import logonfse from "../assets/logo-nfse-horizontal-removebg.png";
import { Separator } from "./ui/separator";
import { useQuery } from "@tanstack/react-query";

type DadosUsuarioAutenticado = {
  cpf: string;
  email: string;
  nome: string;
  matricula: string;
  unidade_cod: string;
};

const getDadosUsuarioAutenticado = async () => {
  const url =
    "https://localhost:8443/ctx/once/PainelNFSe/get_dados_usuario_autenticado";
  const response = await fetch(url);
  const data = await response.json();
  return data as DadosUsuarioAutenticado;
};

const Header = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["dadosUsuarioAutenticado"],
    queryFn: getDadosUsuarioAutenticado,
  });

  return (
    <div className="flex items-center justify-between p-4 md:p-6 shadow-md sticky top-0 bg-[#fafafa] z-50">
      <div className="flex items-center gap-8">
        <img
          className="w-36 h-8 sm:w-40 sm:h-10 md:w-44 md:h-12 lg:w-56 lg:h-14"
          src={logonfse}
          alt="Logo NFSe"
        />
        <Separator
          orientation={"vertical"}
          className="hidden h-8 sm:block sm:h-10 bg-green"
        />
        <p className="hidden sm:block sm:text-lg md:text-2xl text-green font-semibold">
          PAINEL NFSe
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <p className="text-sm sm:text-base md:text-lg text-gray-600">
          {isLoading ? "Carregando..." : data?.nome}
        </p>
        <p className="text-xs sm:text-sm md:text-base text-gray-400">
          {isLoading ? "Carregando..." : formataCPF(data?.cpf ?? "")}
        </p>
      </div>
    </div>
  );
};

export default Header;
