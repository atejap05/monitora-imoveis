import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { JSX } from "react";

// Adiciona suporte a asChild

type BasicTooltipProps = {
  label: string | JSX.Element;
  content: string | JSX.Element;
  asChild?: boolean;
};

const BasicTooltip = ({
  label,
  content,
  asChild = false,
}: BasicTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild={asChild}>{label}</TooltipTrigger>
        <TooltipContent>
          <p className="max-w-56 tracking-wide">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BasicTooltip;
