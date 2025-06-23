import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";

export const contribuinteOptions = [
  { label: "Não Optante", value: "1" },
  { label: "MEI", value: "2" },
  { label: "ME/EPP", value: "3" },
];

export function FormContribuinteValor() {
  const { control } = useFormContext();

  return (
    <>
      <FormItem>
        <FormLabel className="text-green font-bold">
          Tipo de Contribuinte
        </FormLabel>
        <div className="flex flex-col gap-2 w-full mt-2">
          <FormField
            control={control}
            name="contribuintes"
            render={({ field }) => (
              <>
                {contribuinteOptions.map(opt => (
                  <div
                    key={opt.value}
                    className="flex items-center gap-2 w-full"
                  >
                    <FormControl>
                      <Checkbox
                        className="bg-white"
                        checked={field.value?.includes(opt.value) || false}
                        onCheckedChange={checked => {
                          if (checked) {
                            field.onChange([...(field.value || []), opt.value]);
                          } else {
                            field.onChange(
                              (field.value || []).filter(
                                (v: string) => v !== opt.value
                              )
                            );
                          }
                        }}
                        id={`contribuinte-${opt.value}`}
                      />
                    </FormControl>
                    <label
                      htmlFor={`contribuinte-${opt.value}`}
                      className="ml-1 text-sm truncate"
                    >
                      {opt.label}
                    </label>
                  </div>
                ))}
              </>
            )}
          />
        </div>
        <FormMessage />
      </FormItem>
      {/* Label Valor do Serviço */}
      <div className="flex flex-col gap-2 mt-4">
        <span className="text-green font-bold">Valor do Serviço</span>
        <div className="flex gap-4">
          <FormField
            control={control}
            name="valorMin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Valor Mínimo</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Valor mín."
                    className="bg-white no-spinner"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="valorMax"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Valor Máximo</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Valor máx."
                    className="bg-white no-spinner"
                    {...field}
                    value={field.value ?? ""} // Garante string vazia se null
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
}
