import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  // FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { MultiSelect } from "@/components/ui/multi-select";

const FormSchema = z.object({
  uf: z.array(z.string()).nonempty("UF é obrigatório"),
});

export function FormContribuintes() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(JSON.stringify(data, null, 2));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="uf"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-green font-bold">UF</FormLabel>
              <MultiSelect
                onValueChange={field.onChange}
                defaultValue={field.value}
                placeholder="Selecione o Estado"
                options={[
                  { label: "SP", value: "SP" },
                  { label: "BA", value: "BA" },
                  { label: "PI", value: "PI" },
                ]}
              />
              {/* <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white min-w-56">
                    <SelectValue placeholder="Selecione o Estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SP">SP</SelectItem>
                  <SelectItem value="BA">BA</SelectItem>
                  <SelectItem value="PI">PI</SelectItem>
                </SelectContent>
              </Select> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
