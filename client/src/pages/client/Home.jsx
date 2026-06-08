import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ProductCard from "@/components/client/ProductCard";
import FilterBar from "@/components/client/FilterBar";
import {
  getPublicProducts,
  getPublicCategories,
  getPublicCollections,
} from "@/lib/publicApi";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeCollection, setActiveCollection] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFilters = useCallback(async () => {
    try {
      const [catRes, colRes] = await Promise.all([
        getPublicCategories(),
        getPublicCollections(),
      ]);
      setCategories(catRes.data || []);
      setCollections(colRes.data || []);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getPublicProducts({
        categoryId: activeCategory || undefined,
        collectionId: activeCollection || undefined,
      });
      setProducts(res.data || []);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, activeCollection]);

  useEffect(() => { loadFilters(); }, [loadFilters]);
  useEffect(() => { loadProducts(); }, [loadProducts]);

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl text-[#0f1111] font-normal">Product Catalog</h1>
        <p className="text-sm text-[#565959] mt-1">
          Browse our full range — filter by category or collection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <aside className="lg:sticky lg:top-4 lg:self-start">
          <FilterBar
            categories={categories}
            collections={collections}
            activeCategory={activeCategory}
            activeCollection={activeCollection}
            onCategoryChange={setActiveCategory}
            onCollectionChange={setActiveCollection}
            productCount={products.length}
          />
        </aside>

        <div>
          {error && (
            <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-24 text-[#565959] gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading products...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-[#ddd] rounded-lg py-20 text-center">
              <p className="text-[#0f1111] text-lg">No products found</p>
              <p className="text-sm text-[#565959] mt-2">
                Try changing filters or add active products from the admin panel.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
