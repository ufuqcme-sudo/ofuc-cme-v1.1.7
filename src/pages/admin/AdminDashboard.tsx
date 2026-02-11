import { useEffect, useState } from "react";
import {
  Package,
  FileText,
  Settings,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    packages: 0,
    services: 0,
    activePackages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [packagesRes, servicesRes] = await Promise.all([
          supabase.from("packages").select("id, is_active"),
          supabase.from("services").select("id"),
        ]);

        setStats({
          packages: packagesRes.data?.length || 0,
          services: servicesRes.data?.length || 0,
          activePackages:
            packagesRes.data?.filter((p) => p.is_active).length || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: "إجمالي الباقات",
      value: stats.packages,
      icon: Package,
      color: "from-[hsl(180,55%,40%)] to-[hsl(185,65%,30%)]",
    },
    {
      label: "الباقات النشطة",
      value: stats.activePackages,
      icon: TrendingUp,
      color: "from-[hsl(140,55%,40%)] to-[hsl(145,50%,30%)]",
    },
    {
      label: "الخدمات",
      value: stats.services,
      icon: FileText,
      color: "from-[hsl(38,85%,50%)] to-[hsl(30,80%,45%)]",
    },
  ];

  const quickActions = [
    { label: "إدارة الباقات", icon: Package, href: "/admin/packages" },
    { label: "إدارة الخدمات", icon: FileText, href: "/admin/services" },
    { label: "الإعدادات", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <AdminLayout title="مرحباً بك 👋" subtitle="إليك ملخص أداء المنصة">
      {/* Stats Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[hsl(180,55%,45%)]" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="rounded-2xl bg-[hsl(220,20%,10%)] border border-[hsl(220,15%,18%)] p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-[hsl(220,15%,50%)]">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="rounded-2xl bg-[hsl(220,20%,10%)] border border-[hsl(220,15%,18%)] p-6">
        <h2 className="text-lg font-bold text-white mb-4">إجراءات سريعة</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {quickActions.map((action, i) => (
            <Link
              key={i}
              to={action.href}
              className="flex items-center gap-3 p-4 rounded-xl bg-[hsl(220,15%,13%)] border border-[hsl(220,15%,18%)] hover:border-[hsl(180,55%,40%)/0.3] hover:bg-[hsl(220,15%,15%)] transition-all duration-200"
            >
              <action.icon className="h-5 w-5 text-[hsl(180,55%,45%)]" />
              <span className="font-medium text-[hsl(220,15%,75%)]">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
