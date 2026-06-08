import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Folder,
  Layers,
  LayoutDashboard,
  Menu,
  Package,
  Shield,
  Users,
} from "lucide-react";
import { PageShell, DataCard } from "@/components/admin/PageShell";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const ICONS = {
  users: Users,
  folder: Folder,
  layers: Layers,
  package: Package,
  menu: Menu,
  shield: Shield,
};

const GRADIENTS = [
  "from-indigo-500 to-violet-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-blue-600",
  "from-fuchsia-500 to-purple-600",
];

const ROLE_LABELS = {
  super_admin: "Super Admin",
  sub_admin: "Sub Admin",
  admin: "Admin",
};

const AdminHome = () => {
  const { user, hasMenuAccess } = useAuth();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch("/dashboard/stats");
        setStats(res.data?.stats || []);
      } catch {
        setStats([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <PageShell
      title={`Welcome back, ${user?.userName || "Admin"}`}
      description={`${ROLE_LABELS[user?.userType] || "Admin"} dashboard overview`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-36 rounded-2xl bg-muted/50 animate-pulse border border-border"
              />
            ))
          : stats.map((stat, i) => {
              const Icon = ICONS[stat.icon] || LayoutDashboard;
              return (
                <DataCard
                  key={stat.key}
                  className="relative overflow-hidden group hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className="text-4xl font-bold mt-2 tracking-tight">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                          GRADIENTS[i % GRADIENTS.length]
                        )}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-60",
                      GRADIENTS[i % GRADIENTS.length]
                    )}
                  />
                </DataCard>
              );
            })}
      </div>

      {!loading && stats.length > 0 && (
        <DataCard className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Quick access</h3>
          <div className="flex flex-wrap gap-2">
            {hasMenuAccess("menu-master") && (
              <Link to="/admin/menu-master" className="text-xs px-3 py-1.5 rounded-lg bg-muted hover:bg-accent transition-colors">
                Menu Master
              </Link>
            )}
            {hasMenuAccess("role-rights") && (
              <Link to="/admin/role-rights" className="text-xs px-3 py-1.5 rounded-lg bg-muted hover:bg-accent transition-colors">
                Role Rights
              </Link>
            )}
            {hasMenuAccess("products") && (
              <Link to="/admin/products" className="text-xs px-3 py-1.5 rounded-lg bg-muted hover:bg-accent transition-colors">
                Products
              </Link>
            )}
            {hasMenuAccess("users") && (
              <Link to="/admin/users" className="text-xs px-3 py-1.5 rounded-lg bg-muted hover:bg-accent transition-colors">
                Users
              </Link>
            )}
          </div>
        </DataCard>
      )}
    </PageShell>
  );
};

export default AdminHome;
