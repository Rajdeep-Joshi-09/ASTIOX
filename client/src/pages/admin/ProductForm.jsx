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
import { apiFetch, apiUpload, imageUrl } from "@/lib/api";

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([apiFetch("/category"), apiFetch("/collection")])
      .then(([catRes, colRes]) => {
        setCategories(catRes.data || []);
        setCollections(colRes.data || []);
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    apiFetch(`/product/${id}`).then((res) => {
      const item = res.data;
      setProductName(item.productName);
      setProductDescription(item.productDescription || "");
      setCategoryId(String(item.categoryId));
      setCollectionId(String(item.collectionId));
      setIsActive(item.isStatus === 1 || item.isStatus === "Active");
      setExistingImage(item.productImage);
    }).catch((err) => setError(err.message));
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("productName", productName);
      formData.append("productDescription", productDescription);
      formData.append("categoryId", categoryId);
      formData.append("collectionId", collectionId);
      formData.append("isStatus", isActive ? "1" : "0");
      if (imageFile) formData.append("productImage", imageFile);
      if (isEdit) await apiUpload(`/product/${id}`, formData, "PUT");
      else await apiUpload("/product", formData);
      navigate("/admin/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell title={isEdit ? "Edit Product" : "Add Product"} description="Add product details, image, and associations"
      action={<Button variant="outline" asChild><Link to="/admin/products">Back</Link></Button>}>
      <ErrorAlert message={error} />
      <FormCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="productDescription">Description</Label>
            <textarea id="productDescription" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} rows={3}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="productImage">Product Image</Label>
            {existingImage && !imageFile && (
              <img src={imageUrl(existingImage)} alt="Current" className="w-20 h-20 rounded-lg object-cover border border-border mb-2" />
            )}
            <Input id="productImage" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} required={!isEdit && !existingImage} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <SelectField id="categoryId" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.categoryName}</option>)}
            </SelectField>
          </div>
          <div className="space-y-2">
            <Label htmlFor="collectionId">Collection</Label>
            <SelectField id="collectionId" value={collectionId} onChange={(e) => setCollectionId(e.target.value)} required>
              <option value="">Select collection</option>
              {collections.map((c) => <option key={c.id} value={c.id}>{c.collectionType} — {c.inputField}</option>)}
            </SelectField>
          </div>
          <StatusToggle active={isActive} onChange={setIsActive} />
          <Button type="submit" disabled={loading} className="w-full h-10">{loading ? "Saving..." : isEdit ? "Update Product" : "Create Product"}</Button>
        </form>
      </FormCard>
    </PageShell>
  );
};

export default ProductForm;
