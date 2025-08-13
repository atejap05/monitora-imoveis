import React, { useState, useEffect, RefObject } from "react";
import Persona from "../Persona";
import { Button } from "../ui/button";
import { MessageCircle, ExternalLink } from "lucide-react";


export interface HeaderVisibilityProps {
  onVisibilityChange?: (visible: boolean) => void;
  scrollContainerRef?: RefObject<HTMLElement>;
}
const HEADER_HEIGHT = 94; // ajuste conforme necessário

const Header: React.FC<HeaderVisibilityProps> = ({
  onVisibilityChange,
  scrollContainerRef,
}) => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef?.current || window;
    const getScrollY = () =>
      container === window
        ? window.scrollY
        : (container as HTMLElement).scrollTop;
    const handleScroll = () => {
      const currentScrollY = getScrollY();
      if (currentScrollY > lastScrollY && currentScrollY > HEADER_HEIGHT) {
        setShow(false);
        onVisibilityChange?.(false);
      } else {
        setShow(true);
        onVisibilityChange?.(true);
      }
      setLastScrollY(currentScrollY);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line
  }, [lastScrollY, scrollContainerRef]);


  return (
    <header
      className={`shadow-md sticky top-0 bg-[#fafafa] z-40 transition-transform duration-300 ${show ? "translate-y-0" : "-translate-y-full"
        }`}
      style={{ willChange: "transform", height: HEADER_HEIGHT }}
    >
      <div className="flex items-center justify-between p-4 md:px-6 md:py-4">
        <div className="flex flex-col items-start gap-0.5">
          <h1 className="text-xl md:text-2xl font-semibold text-green">
            PAINEL NFSe
          </h1>
          <a
            href="https://rfbgov.sharepoint.com/sites/Sufis/Cofis/SitePages/Dicap.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm md:text-base text-gray-600 hover:text-green transition-colors duration-200 cursor-pointer flex items-center gap-1"
          >
            Divisão de Captação de Dados - DICAP
            <ExternalLink size={12} className="opacity-70" />
          </a>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-green hover:text-green/80 transition-colors duration-200 hover:bg-green/10 rounded-md"
            onClick={() => window.open('https://www.gov.br/nfse/pt-br', '_blank')}
          >
            <ExternalLink size={16} />
            Portal NFSe
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-green hover:text-green/80 transition-colors duration-200 hover:bg-green/10 rounded-md"
            onClick={() => window.open('msteams://teams.microsoft.com/l/chat/0/0?users=joel.pereira@rfb.gov.br', '_blank')}
          >
            <MessageCircle size={16} />
            Contato
          </Button>
          <Persona />
        </div>
      </div>
    </header>
  );
};

export default Header;
