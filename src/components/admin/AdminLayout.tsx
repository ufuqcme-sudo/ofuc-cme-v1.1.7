import { useEffect, useState, ReactNode } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  GraduationCap,
  Package,
  LogOut,
  Loader2,
  LayoutDashboard,
  Settings,
  FileText,
  Menu,
  X,
  ChevronLeft,
  Shield,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const AdminLayout = ({ children, title, subtitle }: AdminLayoutProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          navigate("/admin/login");
          return;
        }

        const { data: adminData, error } = await supabase
          .from("admins")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("is_active", true)
          .maybeSingle();

        if (error || !adminData) {
          await supabase.auth.signOut();
          navigate("/admin/login");
          return;
        }

        setAdminEmail(session.user.email || "");
        setIsAdmin(true);
      } catch {
        navigate("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        navigate("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "تم تسجيل الخروج",
      description: "نراك قريباً!",
    });
    navigate("/admin/login");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "لوحة التحكم", href: "/admin/dashboard" },
    { icon: Package, label: "الباقات", href: "/admin/packages" },
    { icon: FileText, label: "الخدمات", href: "/admin/services" },
    { icon: MessageSquare, label: "آراء العملاء", href: "/admin/reviews" },
    { icon: Settings, label: "الإعدادات", href: "/admin/settings" },
  ];

  if (isLoading) {
    return (
      <div className="admin-theme min-h-screen flex items-center justify-center bg-[hsl(220,20%,10%)]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-[hsl(180,55%,45%)] mx-auto" />
          <p className="text-[hsl(220,15%,60%)]">جاري التحقق...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="admin-theme min-h-screen bg-[hsl(220,20%,7%)] text-[hsl(220,15%,85%)]">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-0 h-full w-72 bg-[hsl(220,20%,10%)] border-l border-[hsl(220,15%,18%)] z-50 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-[hsl(220,15%,18%)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(180,55%,40%)] to-[hsl(185,65%,30%)]">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">أُفُق</h2>
              <div className="flex items-center gap-1 text-xs text-[hsl(180,55%,45%)]">
                <Shield className="h-3 w-3" />
                لوحة التحكم
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-[hsl(220,15%,60%)] hover:text-white hover:bg-[hsl(220,15%,18%)]"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-l from-[hsl(180,55%,40%)/0.15] to-[hsl(180,55%,40%)/0.05] text-[hsl(180,55%,50%)] border border-[hsl(180,55%,40%)/0.2]"
                    : "text-[hsl(220,15%,55%)] hover:text-white hover:bg-[hsl(220,15%,15%)]"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <ChevronLeft className="h-4 w-4 mr-auto" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 right-0 left-0 p-4 border-t border-[hsl(220,15%,18%)]">
          <div className="flex items-center gap-3 px-3 py-2 mb-3">
            <div className="h-9 w-9 rounded-full bg-[hsl(220,15%,18%)] flex items-center justify-center text-sm font-bold text-[hsl(180,55%,50%)]">
              {adminEmail.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{adminEmail}</p>
              <p className="text-xs text-[hsl(220,15%,45%)]">مدير</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-[hsl(220,15%,55%)] hover:text-[hsl(0,72%,55%)] hover:bg-[hsl(0,72%,55%)/0.1]"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pr-72">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[hsl(220,20%,7%)/0.95] backdrop-blur-md border-b border-[hsl(220,15%,18%)] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">{title}</h1>
              {subtitle && (
                <p className="text-sm text-[hsl(220,15%,50%)]">{subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                target="_blank"
                className="text-xs text-[hsl(220,15%,50%)] hover:text-[hsl(180,55%,50%)] transition-colors hidden sm:block"
              >
                عرض الموقع ←
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-[hsl(220,15%,60%)] hover:text-white hover:bg-[hsl(220,15%,18%)]"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
