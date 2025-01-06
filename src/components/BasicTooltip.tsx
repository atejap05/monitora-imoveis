import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type BasicTooltipProps = {
  label: string;
  content: string;
};

const BasicTooltip = ({ label, content }: BasicTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{label}</TooltipTrigger>
        <TooltipContent>
          <p className="max-w-56 tracking-wide">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BasicTooltip;
