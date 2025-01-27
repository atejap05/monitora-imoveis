import { formataCPF } from "@/lib/utils";
import { getDadosUsuarioAutenticado } from "@/service";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";

const Persona = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["dadosUsuarioAutenticado"],
    queryFn: getDadosUsuarioAutenticado,
  });

  if (isLoading) {
    return <PersonaSkeleton />;
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <p className="text-sm sm:text-base md:text-lg text-gray-600">
        {data?.nome}
      </p>
      <p className="text-xs sm:text-sm md:text-base text-gray-400">
        {formataCPF(data?.cpf ?? "")}
      </p>
    </div>
  );
};

export default Persona;

////// Skeleton Persona //////
const PersonaSkeleton = () => {
  return (
    <div className="flex flex-col items-end gap-1">
      <Skeleton className="h-4 w-28 sm:h-5 sm:w-38 md:h-6 md:w-48" />
      <Skeleton className="h-3 w-24 sm:h-4 sm:w-34 md:h-5 md:w-44" />
    </div>
  );
};

export { PersonaSkeleton };
