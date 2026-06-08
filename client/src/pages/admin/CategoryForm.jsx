import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormCard, PageShell, StatusToggle, ErrorAlert } from "@/components/admin/PageShell";
import { apiFetch } from "@/lib/api";

const CategoryForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    apiFetch(`/category/${id}`).then((res) => {
      setCategoryName(res.data.categoryName);
      setIsActive(res.data.isStatus === 1 || res.data.isStatus === "Active");
    }).catch((err) => setError(err.message));
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const body = { categoryName, isStatus: isActive ? 1 : 0 };
      if (isEdit) await apiFetch(`/category/${id}`, { method: "PUT", body: JSON.stringify(body) });
      else await apiFetch("/category", { method: "POST", body: JSON.stringify(body) });
      navigate("/admin/category");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell title={isEdit ? "Edit Category" : "Add Category"} description="Manage product categories"
      action={<Button variant="outline" asChild><Link to="/admin/category">Back</Link></Button>}>
      <ErrorAlert message={error} />
      <FormCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input id="categoryName" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required minLength={5} placeholder="Min 5 characters" />
          </div>
          <StatusToggle active={isActive} onChange={setIsActive} />
          <Button type="submit" disabled={loading} className="w-full h-10">{loading ? "Saving..." : isEdit ? "Update" : "Create"}</Button>
        </form>
      </FormCard>
    </PageShell>
  );
};

export default CategoryForm;
