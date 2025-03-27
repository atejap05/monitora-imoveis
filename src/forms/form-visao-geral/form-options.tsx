import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const options = [
  { label: "Todos", value: "todos" },
  { label: "UF", value: "uf" },
  { label: "Município", value: "municipio" },
  { label: "Região", value: "regiao" },
];

export const FormOptions = ({
  selectedOption,
  setSelectedOption,
}: {
  selectedOption: string;
  setSelectedOption: (value: string) => void;
}) => {
  return (
    <>
      <Label htmlFor="filter_option" className="text-green font-bold">
        Filtrar por:
      </Label>
      <RadioGroup
        id="filter_option"
        onValueChange={setSelectedOption}
        defaultValue={selectedOption}
        className="grid grid-cols-2 gap-4 my-3"
      >
        {options.map(option => (
          <div
            key={option.value}
            className="flex items-center justify-start gap-2"
          >
            <RadioGroupItem
              className="bg-white"
              id={option.value}
              value={option.value}
            />
            <Label htmlFor={option.value} className="font-normal">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </>
  );
};
