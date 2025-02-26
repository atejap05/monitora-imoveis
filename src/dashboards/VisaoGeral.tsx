import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

const VisaoGeral = () => {
  return (
    <TabsContent className="px-4" value="visao-geral">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-6 lg:mb-8">
        Visão Geral
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Valor Total</CardTitle>
            <CardDescription>
              Valor total de todas as notas fiscais
            </CardDescription>
          </CardHeader>
          <CardContent>R$ 0,00</CardContent>
          <CardFooter>Atualizado em tempo real</CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Valor Total</CardTitle>
            <CardDescription>
              Valor total de todas as notas fiscais
            </CardDescription>
          </CardHeader>
          <CardContent>R$ 0,00</CardContent>
          <CardFooter>Atualizado em tempo real</CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Valor Total</CardTitle>
            <CardDescription>
              Valor total de todas as notas fiscais
            </CardDescription>
          </CardHeader>
          <CardContent>R$ 0,00</CardContent>
          <CardFooter>Atualizado em tempo real</CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Valor Total</CardTitle>
            <CardDescription>
              Valor total de todas as notas fiscais
            </CardDescription>
          </CardHeader>
          <CardContent>R$ 0,00</CardContent>
          <CardFooter>Atualizado em tempo real</CardFooter>
        </Card>
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Valor Total</CardTitle>
            <CardDescription>
              Valor total de todas as notas fiscais
            </CardDescription>
          </CardHeader>
          <CardContent>LineCart</CardContent>
          <CardFooter>Atualizado em tempo real</CardFooter>
        </Card>
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Valor Total</CardTitle>
            <CardDescription>
              Valor total de todas as notas fiscais
            </CardDescription>
          </CardHeader>
          <CardContent>LineCart</CardContent>
          <CardFooter>Atualizado em tempo real</CardFooter>
        </Card>
      </div>
    </TabsContent>
  );
};

export default VisaoGeral;
