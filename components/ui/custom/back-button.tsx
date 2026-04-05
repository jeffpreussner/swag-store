import { Button } from "@/components/ui/button";
export function BackButton() {
  return (
    <Button onClick={() => window.history.back()}>
      Go back and try again later
    </Button>
  );
}
