import { useEffect, useState } from "react";
import { Shield, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell, DataCard, ErrorAlert, SelectField } from "@/components/admin/PageShell";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "sub_admin", label: "Sub Admin" },
];

const RoleRights = () => {
  const { refreshAuth } = useAuth();
  const [userType, setUserType] = useState("admin");
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async (role) => {
    try {
      setLoading(true);
      setError("");
      const res = await apiFetch(`/permissions/${role}`);
      setPermissions(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(userType);
  }, [userType]);

  const toggle = (menuId) => {
    setPermissions((prev) =>
      prev.map((p) =>
        p.menuId === menuId ? { ...p, canAccess: !p.canAccess } : p
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await apiFetch(`/permissions/${userType}`, {
        method: "PUT",
        body: JSON.stringify({
          permissions: permissions.map((p) => ({
            menuId: p.menuId,
            canAccess: p.canAccess,
          })),
        }),
      });
      setSuccess("Permissions saved successfully");
      refreshAuth();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell
      title="Role Rights"
      description="Assign menu access per user type. Super admin always has full access."
      action={
        <Button onClick={handleSave} disabled={saving || loading}>
          <Save className="w-4 h-4 mr-1" />
          {saving ? "Saving..." : "Save Rights"}
        </Button>
      }
    >
      <ErrorAlert message={error} />
      {success && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
          {success}
        </div>
      )}

      <DataCard className="p-6 space-y-6">
        <div className="max-w-xs space-y-2">
          <label className="text-sm font-medium">Select User Type</label>
          <SelectField
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </SelectField>
        </div>

        {loading ? (
          <div className="text-center py-10 text-muted-foreground">Loading permissions...</div>
        ) : (
          <div className="grid gap-3">
            {permissions.map((perm) => (
              <button
                key={perm.menuId}
                type="button"
                onClick={() => !perm.isDeveloperOnly && toggle(perm.menuId)}
                disabled={perm.isDeveloperOnly}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                  perm.canAccess
                    ? "border-indigo-500/50 bg-indigo-500/5"
                    : "border-border bg-muted/20",
                  perm.isDeveloperOnly && "opacity-60 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      perm.canAccess
                        ? "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{perm.menuName}</p>
                    <p className="text-xs text-muted-foreground font-mono">{perm.menuPath}</p>
                    {perm.isDeveloperOnly && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                        Developer only — super admin access
                      </p>
                    )}
                  </div>
                </div>
                <div
                  className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center",
                    perm.canAccess
                      ? "border-indigo-500 bg-indigo-500"
                      : "border-muted-foreground/30"
                  )}
                >
                  {perm.canAccess && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </DataCard>
    </PageShell>
  );
};

export default RoleRights;
