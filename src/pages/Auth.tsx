import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Wand2, Loader2, ArrowRight } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";
import { MovingBorderButton } from "@/components/ui/moving-border";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { user, signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (error) {
      toast.error("Sign in failed", { description: error.message });
    } else {
      toast.success("Welcome back!");
      navigate("/app");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(email, password);
    setIsLoading(false);

    if (error) {
      if (error.message.includes("already registered")) {
        toast.error("Account already exists", { description: "Try signing in instead" });
      } else {
        toast.error("Sign up failed", { description: error.message });
      }
    } else {
      toast.success("Account created!", { description: "You can now sign in" });
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const { error } = await signInWithGoogle();
    setIsGoogleLoading(false);

    if (error) {
      toast.error("Google sign in failed", { description: error.message });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black/[0.96] antialiased bg-grid-white/[0.02]">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="w-full backdrop-blur-xl bg-black/40 border-white/10 shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md">
                <Wand2 className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
              DesignForge
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Welcome back. Sign in to your workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10">
                <TabsTrigger value="signin" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">Sign Up</TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-neutral-300">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-white/20 focus:ring-1 focus:ring-white/20"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="text-neutral-300">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-white/20 focus:ring-1 focus:ring-white/20"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full relative group/btn flex space-x-2 items-center justify-center px-4 py-2 text-black bg-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] hover:bg-neutral-200 transition duration-200"
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <span>Sign In &rarr;</span>
                      <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
                      <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-sm opacity-0 transition duration-500 group-hover/btn:opacity-100" />
                    </button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-neutral-300">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-white/20 focus:ring-1 focus:ring-white/20"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-neutral-300">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-white/20 focus:ring-1 focus:ring-white/20"
                        required
                        minLength={6}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full relative group/btn flex space-x-2 items-center justify-center px-4 py-2 text-black bg-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] hover:bg-neutral-200 transition duration-200"
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <span>Create Account &rarr;</span>
                      <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
                      <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-sm opacity-0 transition duration-500 group-hover/btn:opacity-100" />
                    </button>
                  </form>
                </TabsContent>
              </div>
            </Tabs>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-neutral-500">Or continue with</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full bg-transparent border-white/10 text-neutral-300 hover:bg-white/5 hover:text-white"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Google
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
