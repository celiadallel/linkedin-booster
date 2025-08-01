import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/context";
import { Link, useLocation } from "react-router-dom";

export function Header() {
  const { stats } = useApp();
  const location = useLocation();
  
  // Helper to check if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-blue-600"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect width="4" height="12" x="2" y="9"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
            <span className="hidden text-xl font-bold sm:inline-block">
              LinkedIn Community Booster
            </span>
            <span className="text-xl font-bold sm:hidden">LCB</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
              isActive('/') ? 'text-foreground' : 'text-foreground/60'
            }`}
          >
            Accueil
          </Link>
          <Link 
            to="/add-post" 
            className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
              isActive('/add-post') ? 'text-foreground' : 'text-foreground/60'
            }`}
          >
            Ajouter un post
          </Link>
          <Link 
            to="/explore" 
            className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
              isActive('/explore') ? 'text-foreground' : 'text-foreground/60'
            }`}
          >
            Explorer
          </Link>
          <Link 
            to="/community" 
            className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
              isActive('/community') ? 'text-foreground' : 'text-foreground/60'
            }`}
          >
            Ma communauté
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/profile">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-5 w-5"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}