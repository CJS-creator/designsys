import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { ArrowLeft, Loader2, User as UserIcon } from "lucide-react";
import { SEO } from "@/components/SEO";

const Profile = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, username, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        toast.error("Failed to load profile", { description: error.message });
      } else if (data) {
        setFullName(data.full_name ?? "");
        setUsername(data.username ?? "");
        setAvatarUrl(data.avatar_url ?? "");
      }
      setLoading(false);
    })();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: fullName.trim() || null,
        username: username.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      });

    setSaving(false);

    if (error) {
      toast.error("Failed to save", { description: error.message });
    } else {
      toast.success("Profile updated");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <SEO
        title="Profile — DesignForge"
        description="Manage your DesignForge profile and account details."
        path="/profile"
      />
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/app">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to app
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary" /> Profile
            </CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {(fullName || username || user.email || "U")[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm text-muted-foreground">
                    <p>{user.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="janedoe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar-url">Avatar URL</Label>
                  <Input
                    id="avatar-url"
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save changes
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
