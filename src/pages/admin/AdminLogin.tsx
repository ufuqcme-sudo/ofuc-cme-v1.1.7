import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Lock, Eye, EyeOff, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    const checkExistingSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: adminData } = await supabase
          .from("admins")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("is_active", true)
          .maybeSingle();

        if (adminData) {
          navigate("/admin/dashboard");
        }
      }
    };
    checkExistingSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: adminData, error: adminError } = await supabase
          .from("admins")
          .select("id")
          .eq("user_id", data.user.id)
          .eq("is_active", true)
          .maybeSingle();

        if (adminError) throw adminError;

        if (adminData) {
          toast({
            title: "تم تسجيل الدخول بنجاح",
            description: "مرحباً بك في لوحة التحكم",
          });
          navigate("/admin/dashboard");
        } else {
          await supabase.auth.signOut();
          toast({
            title: "غير مصرح",
            description: "ليس لديك صلاحية الوصول للوحة التحكم",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message || "تحقق من البريد الإلكتروني وكلمة المرور",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(220,20%,7%)] flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[hsl(180,55%,45%)/0.05] rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[hsl(38,85%,50%)/0.03] rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl bg-[hsl(220,20%,10%)] border border-[hsl(220,15%,18%)] p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(180,55%,40%)] to-[hsl(185,65%,30%)] mb-4">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">لوحة التحكم</h1>
            <div className="flex items-center justify-center gap-1.5 mt-2 text-sm text-[hsl(220,15%,50%)]">
              <Shield className="h-4 w-4" />
              <span>تسجيل دخول المسؤول</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[hsl(220,15%,70%)]">
                البريد الإلكتروني
              </Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(220,15%,40%)]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@ofuq.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-10 bg-[hsl(220,15%,13%)] border-[hsl(220,15%,20%)] text-white placeholder:text-[hsl(220,15%,35%)] focus:border-[hsl(180,55%,40%)] focus:ring-[hsl(180,55%,40%)]"
                  required
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[hsl(220,15%,70%)]">
                كلمة المرور
              </Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(220,15%,40%)]" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 pl-10 bg-[hsl(220,15%,13%)] border-[hsl(220,15%,20%)] text-white placeholder:text-[hsl(220,15%,35%)] focus:border-[hsl(180,55%,40%)] focus:ring-[hsl(180,55%,40%)]"
                  required
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(220,15%,40%)] hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-[hsl(180,55%,40%)] to-[hsl(185,65%,30%)] text-white font-bold hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                "تسجيل الدخول"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-[hsl(220,15%,45%)] hover:text-[hsl(180,55%,50%)] transition-colors"
            >
              العودة للصفحة الرئيسية
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
