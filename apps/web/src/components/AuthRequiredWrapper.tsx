import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, User } from "lucide-react";

interface AuthRequiredWrapperProps {
  children: ReactNode;
  title: string;
  description: string;
  icon?: ReactNode;
}

export const AuthRequiredWrapper = ({ 
  children, 
  title, 
  description,
  icon 
}: AuthRequiredWrapperProps) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Card className="border-dashed">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            {icon || <Lock className="h-6 w-6 text-primary" />}
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild>
            <Link to="/auth">
              <User className="mr-2 h-4 w-4" />
              Sign In to Unlock
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};
