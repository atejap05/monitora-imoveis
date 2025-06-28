import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactNode } from "react";

// Adiciona suporte a asChild

type BasicTooltipProps = {
  children: ReactNode;
  content: string | ReactNode;
  asChild?: boolean;
};

const BasicTooltip = ({
  children,
  content,
  asChild = false,
}: BasicTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        <TooltipContent>
          <p className="max-w-56 tracking-wide">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BasicTooltip;
