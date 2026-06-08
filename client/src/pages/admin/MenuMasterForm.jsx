import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FormCard,
  PageShell,
  StatusToggle,
  ErrorAlert,
  SelectField,
} from "@/components/admin/PageShell";
import { apiFetch } from "@/lib/api";

const ICON_OPTIONS = [
  "layout-dashboard",
  "users",
  "folder",
  "layers",
  "package",
  "menu",
  "shield",
];

const MenuMasterForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [menuName, setMenuName] = useState("");
  const [menuKey, setMenuKey] = useState("");
  const [menuPath, setMenuPath] = useState("/admin/");
  const [icon, setIcon] = useState("layout-dashboard");
  const [sortOrder, setSortOrder] = useState(0);
  const [isDeveloperOnly, setIsDeveloperOnly] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const res = await apiFetch(`/menu/${id}`);
        const item = res.data;
        setMenuName(item.menuName);
        setMenuKey(item.menuKey);
        setMenuPath(item.menuPath);
        setIcon(item.icon || "layout-dashboard");
        setSortOrder(item.sortOrder || 0);
        setIsDeveloperOnly(item.isDeveloperOnly);
        setIsActive(item.isStatus === 1 || item.isStatus === "Active");
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = {
        menuName,
        menuKey,
        menuPath,
        icon,
        sortOrder: Number(sortOrder),
        isDeveloperOnly,
        isStatus: isActive ? 1 : 0,
      };
      if (isEdit) {
        await apiFetch(`/menu/${id}`, { method: "PUT", body: JSON.stringify(body) });
      } else {
        await apiFetch("/menu", { method: "POST", body: JSON.stringify(body) });
      }
      navigate("/admin/menu-master");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title={isEdit ? "Edit Menu" : "Create Menu"}
      description="Configure navigation items for the admin panel"
      action={
        <Button variant="outline" asChild>
          <Link to="/admin/menu-master">Back</Link>
        </Button>
      }
    >
      <ErrorAlert message={error} />
      <FormCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="menuName">Menu Name</Label>
            <Input id="menuName" value={menuName} onChange={(e) => setMenuName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="menuKey">Menu Key</Label>
            <Input
              id="menuKey"
              value={menuKey}
              onChange={(e) => setMenuKey(e.target.value.toLowerCase())}
              placeholder="e.g. users"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="menuPath">Menu Path</Label>
            <Input
              id="menuPath"
              value={menuPath}
              onChange={(e) => setMenuPath(e.target.value)}
              placeholder="/admin/users"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <SelectField id="icon" value={icon} onChange={(e) => setIcon(e.target.value)}>
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </SelectField>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input
                id="sortOrder"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              />
            </div>
          </div>
          <StatusToggle
            active={isDeveloperOnly}
            onChange={setIsDeveloperOnly}
            label="Developer Only"
          />
          <StatusToggle active={isActive} onChange={setIsActive} />
          <Button type="submit" disabled={loading} className="w-full h-10">
            {loading ? "Saving..." : isEdit ? "Update Menu" : "Create Menu"}
          </Button>
        </form>
      </FormCard>
    </PageShell>
  );
};

export default MenuMasterForm;
