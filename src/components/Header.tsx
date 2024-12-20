import logonfse from "../assets/logo-nfse-horizontal-removebg.png";
import { Separator } from "./ui/separator";

const Header = () => {
  return (
    <div className="flex items-center justify-between p-4 md:p-6 w-full shadow-md sticky top-0 bg-[#fafafa] z-50">
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
      <div>
        <p>
          {/* implementar persona */}
          <strong>Usuário:</strong> <span>Usuário</span>
        </p>
      </div>
    </div>
  );
};

export default Header;
