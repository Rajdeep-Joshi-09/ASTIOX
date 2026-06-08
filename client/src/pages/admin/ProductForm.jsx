import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/admin/RichTextEditor";
import {
  PageShell,
  StatusToggle,
  ErrorAlert,
  SelectField,
} from "@/components/admin/PageShell";
import { apiFetch, apiUpload, imageUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [existingImages, setExistingImages] = useState([]);
  const [removeImageIds, setRemoveImageIds] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
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
    apiFetch(`/product/${id}`)
      .then((res) => {
        const item = res.data;
        setProductName(item.productName);
        setProductDescription(item.productDescription || "");
        setCategoryId(String(item.categoryId));
        setCollectionId(String(item.collectionId));
        setIsActive(item.isStatus === 1 || item.isStatus === "Active");
        setExistingImages(item.images || []);
      })
      .catch((err) => setError(err.message));
  }, [id, isEdit]);

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setNewFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setNewPreviews((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeExisting = (imageId) => {
    setRemoveImageIds((prev) => [...prev, imageId]);
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const removeNew = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const visibleCount = existingImages.length + newFiles.length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (visibleCount === 0) {
      setError("Please upload at least one product image");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("productName", productName);
      formData.append("productDescription", productDescription);
      formData.append("categoryId", categoryId);
      formData.append("collectionId", collectionId);
      formData.append("isStatus", isActive ? "1" : "0");
      newFiles.forEach((file) => formData.append("productImages", file));
      if (isEdit && removeImageIds.length) {
        formData.append("removeImageIds", JSON.stringify(removeImageIds));
      }
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
    <PageShell
      title={isEdit ? "Edit Product" : "Add Product"}
      description="Rich description with tables, multiple images, category & collection"
      action={
        <Button variant="outline" asChild>
          <Link to="/admin/products">Back</Link>
        </Button>
      }
    >
      <ErrorAlert message={error} />
      <div className="flex justify-center">
        <div className="w-full max-w-3xl bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Product Description</Label>
              <p className="text-xs text-muted-foreground">
                Use the editor to format text, create tables, lists, and headings. Content is saved as HTML.
              </p>
              <RichTextEditor
                value={productDescription}
                onChange={setProductDescription}
                placeholder="Describe the product — specs, features, tables..."
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="productImages">Product Images</Label>
                <span className="text-xs text-muted-foreground">{visibleCount} image(s)</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Upload multiple images. First image is used as the primary thumbnail on the storefront.
              </p>

              {(existingImages.length > 0 || newPreviews.length > 0) && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                      <img src={imageUrl(img.imagePath)} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExisting(img.id)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {newPreviews.map((src, i) => (
                    <div key={`new-${i}`} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNew(i)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label
                className={cn(
                  "flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-border",
                  "hover:border-primary/50 hover:bg-muted/30 cursor-pointer transition-colors"
                )}
              >
                <span className="text-sm text-muted-foreground">Click to add images</span>
                <span className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP — up to 12 images</span>
                <input
                  id="productImages"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFilesChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <SelectField id="categoryId" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.categoryName}</option>
                  ))}
                </SelectField>
              </div>
              <div className="space-y-2">
                <Label htmlFor="collectionId">Collection</Label>
                <SelectField id="collectionId" value={collectionId} onChange={(e) => setCollectionId(e.target.value)} required>
                  <option value="">Select collection</option>
                  {collections.map((c) => (
                    <option key={c.id} value={c.id}>{c.collectionType} — {c.inputField}</option>
                  ))}
                </SelectField>
              </div>
            </div>

            <StatusToggle active={isActive} onChange={setIsActive} />

            <Button type="submit" disabled={loading} className="w-full h-10">
              {loading ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
            </Button>
          </form>
        </div>
      </div>
    </PageShell>
  );
};

export default ProductForm;
