import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const DashCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Total</CardTitle>
        <p className="text-2xl font-bold">R$ 100.000,00</p>
      </CardHeader>
      <CardContent>
        <p className="mt-2 text-sm text-muted-foreground">
          Varia o de 10% em rela o ao m s anterior
        </p>
      </CardContent>
    </Card>
  );
};

export default DashCard;
