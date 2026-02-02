import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden antialiased">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20 opacity-50 dark:opacity-20"
        fill="hsl(var(--primary))"
      />

      <div className="relative z-10 text-center space-y-8 px-4 animate-in fade-in zoom-in duration-500">
        <div className="space-y-4">
          <h1 className="text-9xl font-black bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground/20 leading-tight">
            404
          </h1>
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Lost in the Forge?
            </h2>
            <p className="text-muted-foreground max-w-sm mx-auto font-medium">
              We couldn't find the page you're looking for. It might have been moved or doesn't exist.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild variant="default" size="lg" className="h-12 px-8 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 px-8 rounded-2xl font-bold bg-background/50 border-2 transition-all">
            <Link to="/app">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground font-mono opacity-50">
          Error Reference: {location.pathname}
        </p>
      </div>
    </div>
  );
};

export default NotFound;
