import { ReactNode } from "react";
import { Header } from "./header";
import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6">
        {children}
      </main>
      <footer className="border-t py-4 bg-muted/40">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-sm text-muted-foreground">
          <p>
            © 2025 LinkedIn Community Booster - AI Edition
          </p>
          <nav className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-colors">
              Conditions d'utilisation
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Confidentialité
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </footer>
      <Toaster position="bottom-right" />
    </div>
  );
}