import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/dashboard", { replace: true });
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard", { replace: true });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message?.toLowerCase().includes("confirm")) {
          toast({
            title: "Email confirmation required",
            description: "Disable 'Confirm email' in Supabase Auth settings to allow direct sign in.",
          });
          return;
        }
        throw error;
      }

      if (data.user?.id) {
        // Ensure a profile exists for the user
        await supabase.from("profiles").upsert({ id: data.user.id });
      }

      toast({ title: "Signed in", description: "Welcome back!" });
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Sign in failed", description: err.message ?? "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) {
        const msg = String(error.message || "").toLowerCase();
        if (msg.includes("already") || msg.includes("exists")) {
          toast({ title: "Email already registered", description: "Try signing in instead." });
          return;
        }
        throw error;
      }

      // If email confirmation is disabled, session is returned here
      if (data.session?.user) {
        await supabase.from("profiles").upsert({
          id: data.session.user.id,
          full_name: email.split("@")[0],
        });
        toast({ title: "Account created", description: "You're now signed in!" });
        navigate("/dashboard");
        return;
      }

      // If confirmation is still enabled, try to sign in immediately
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        if (signInError.message?.toLowerCase().includes("confirm")) {
          toast({
            title: "Email confirmation required",
            description: "Disable 'Confirm email' in Supabase Auth settings to sign in without verification.",
          });
          return;
        }
        throw signInError;
      }

      if (signInData.user?.id) {
        await supabase.from("profiles").upsert({
          id: signInData.user.id,
          full_name: email.split("@")[0],
        });
      }

      toast({ title: "Account created", description: "You're now signed in!" });
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Sign up failed", description: err.message ?? "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-md mx-auto px-4 py-10">
        <Card className="p-6 learning-card">
          <h1 className="text-2xl font-bold mb-2">Account</h1>
          <p className="text-muted-foreground mb-6">Sign in or create your account</p>
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" />
                </div>
                <Button className="w-full" disabled={loading} onClick={handleSignIn}>Sign In</Button>
              </div>
            </TabsContent>
            <TabsContent value="signup">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email2">Email</Label>
                  <Input id="email2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password2">Password</Label>
                  <Input id="password2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" />
                </div>
                <Button className="w-full" disabled={loading} onClick={handleSignUp}>Create Account</Button>
                <p className="text-xs text-muted-foreground">Your account will be created instantly.</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
};

export default Auth;
