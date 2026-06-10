import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Trash2, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PageShell,
  DataCard,
  StatusBadge,
  ErrorAlert,
} from "@/components/admin/PageShell";
import { apiFetch } from "@/lib/api";

const MenuMasterList = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/menu");
      setMenus(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this menu?")) return;
    try {
      await apiFetch(`/menu/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <PageShell
      title="Menu Master"
      description="Developer-only menu configuration. Super admin access required."
      action={
        <Button asChild>
          <Link to="/admin/menu-master/new">
            <Plus className="w-4 h-4 mr-1" /> Add Menu
          </Link>
        </Button>
      }
    >
      <ErrorAlert message={error} />

      <DataCard>
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Name
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Key
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Path
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Type
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  Loading...
                </td>
              </tr>
            ) : menus.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No menus found
                </td>
              </tr>
            ) : (
              menus.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border/50 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium">{item.menuName}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {item.menuKey}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.menuPath}
                  </td>
                  <td className="px-4 py-3">
                    {item.isDeveloperOnly ? (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                        <Code2 className="w-3 h-3" /> Developer
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Standard
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge active={item.isStatus === "Active"} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/admin/menu-master/${item.id}/edit`}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </DataCard>
    </PageShell>
  );
};

export default MenuMasterList;
