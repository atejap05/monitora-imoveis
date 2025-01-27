import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import { years } from "@/lib/utils";

const FormAnoSchema = z.object({
  ano: z.array(z.string()).optional(),
});

export const FormAno = ({
  onSubmit,
  isPending,
}: {
  isPending: boolean;
  onSubmit: (data: z.infer<typeof FormAnoSchema>) => void;
}) => {
  const form = useForm<z.infer<typeof FormAnoSchema>>({
    resolver: zodResolver(FormAnoSchema),
    defaultValues: {
      ano: [],
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="ano"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-green font-bold">Ano</FormLabel>
              <FormControl>
                <MultiSelect
                  className="bg-white"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  options={years.map(year => ({
                    label: year,
                    value: year,
                  }))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center mt-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Aplicando..." : "Aplicar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
