import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormCard, PageShell, StatusToggle, ErrorAlert } from "@/components/admin/PageShell";
import { apiFetch } from "@/lib/api";

const CollectionForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [collectionType, setCollectionType] = useState("");
  const [inputField, setInputField] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    apiFetch(`/collection/${id}`).then((res) => {
      const item = res.data;
      setCollectionType(item.collectionType);
      setInputField(item.inputField);
      setIsActive(item.isStatus === 1 || item.isStatus === "Active");
    }).catch((err) => setError(err.message));
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const body = { collectionType, inputField, isStatus: isActive ? 1 : 0 };
      if (isEdit) await apiFetch(`/collection/${id}`, { method: "PUT", body: JSON.stringify(body) });
      else await apiFetch("/collection", { method: "POST", body: JSON.stringify(body) });
      navigate("/admin/collection");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell title={isEdit ? "Edit Collection" : "Add Collection"} description="Define collection types and input fields"
      action={<Button variant="outline" asChild><Link to="/admin/collection">Back</Link></Button>}>
      <ErrorAlert message={error} />
      <FormCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="collectionType">Collection Type</Label>
            <Input id="collectionType" value={collectionType} onChange={(e) => setCollectionType(e.target.value)} required placeholder="e.g. Seasonal" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inputField">Input Field</Label>
            <Input id="inputField" value={inputField} onChange={(e) => setInputField(e.target.value)} required placeholder="e.g. Summer 2026" />
          </div>
          <StatusToggle active={isActive} onChange={setIsActive} />
          <Button type="submit" disabled={loading} className="w-full h-10">{loading ? "Saving..." : isEdit ? "Update" : "Create"}</Button>
        </form>
      </FormCard>
    </PageShell>
  );
};

export default CollectionForm;
