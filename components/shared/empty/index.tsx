import { Card, CardContent } from "@/components/ui/card";

interface EmptyProps {
  text: string;
}

export default function Empty({ text }: EmptyProps) {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <p className="text-center text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  );
}
