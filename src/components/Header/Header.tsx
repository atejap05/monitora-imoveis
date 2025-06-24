import React, { useState, useEffect, RefObject } from "react";
import Persona from "../Persona";

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
      className={`shadow-md sticky top-0 bg-[#fafafa] z-40 transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ willChange: "transform", height: HEADER_HEIGHT }}
    >
      <div className="flex items-center justify-between p-4 md:p-6">
        <div className="flex flex-col items-start gap-0.5">
          <h1 className="text-xl md:text-2xl font-semibold text-green">
            PAINEL NFSe
          </h1>
          <h2 className="text-sm md:text-base text-gray-600">
            Divisão de Captação de Dados - DICAP
          </h2>
        </div>
        <Persona />
      </div>
    </header>
  );
};

export default Header;
