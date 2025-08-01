import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-lg text-muted-foreground">
          Cette page n'existe pas ou a été supprimée.
        </p>
      </div>
      <Button asChild>
        <Link to="/">Retour à l'accueil</Link>
      </Button>
    </div>
  );
}