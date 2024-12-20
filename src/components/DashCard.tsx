import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type DashCardProps = {
  title: string;
  value: string;
  description: string;
};

const DashCard = ({ title, value, description }: DashCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <p className="text-2xl font-bold">{value}</p>
      </CardHeader>
      <CardContent>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default DashCard;
