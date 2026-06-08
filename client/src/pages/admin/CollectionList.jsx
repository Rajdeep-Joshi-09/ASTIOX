import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell, DataCard, StatusBadge, ErrorAlert } from "@/components/admin/PageShell";
import { apiFetch } from "@/lib/api";

const CollectionList = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/collection");
      setCollections(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this collection?")) return;
    try {
      await apiFetch(`/collection/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <PageShell title="Collections" description="Manage product collections"
      action={<Button asChild><Link to="/admin/collection/new"><Plus className="w-4 h-4 mr-1" /> Add Collection</Link></Button>}>
      <ErrorAlert message={error} />
      <DataCard>
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Collection Type</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Input Field</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">Loading...</td></tr>
            ) : collections.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">No collections found</td></tr>
            ) : (
              collections.map((item) => (
                <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{item.collectionType}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.inputField}</td>
                  <td className="px-4 py-3"><StatusBadge active={item.isStatus === "Active"} /></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/admin/collection/${item.id}/edit`}><Pencil className="w-3.5 h-3.5" /></Link>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)} className="text-destructive hover:text-destructive">
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

export default CollectionList;
