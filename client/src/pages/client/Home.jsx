import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, Loader2 } from "lucide-react";
import ProductCard from "@/components/client/ProductCard";
import FilterBar from "@/components/client/FilterBar";
import {
  getPublicProducts,
  getPublicCategories,
  getPublicCollections,
} from "@/lib/publicApi";
import { cn } from "@/lib/utils";

const Home = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [activeCategory, setActiveCategory] = useState(
    () => searchParams.get("category") || ""
  );
  const [activeCollection, setActiveCollection] = useState(
    () => searchParams.get("collection") || ""
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(
    () => !!(searchParams.get("category") || searchParams.get("collection"))
  );

  useEffect(() => {
    const category = searchParams.get("category") || "";
    const collection = searchParams.get("collection") || "";
    setActiveCategory(category);
    setActiveCollection(collection);
    if (category || collection) setFiltersOpen(true);
  }, [searchParams]);

  const activeFilterCount =
    (activeCategory ? 1 : 0) + (activeCollection ? 1 : 0);

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

  useEffect(() => {
    loadFilters();
  }, [loadFilters]);
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const clearFilters = () => {
    setActiveCategory("");
    setActiveCollection("");
  };

  return (
    <div>
      {/* Hero */}
      <section className="text-center px-4 sm:px-6 py-12 sm:py-16 md:py-24 max-w-3xl mx-auto">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] text-store-fg font-normal leading-tight tracking-tight">
          Curated Excellence.
        </h1>
        <p className="mt-4 sm:mt-6 text-sm md:text-[15px] text-store-muted leading-relaxed max-w-xl mx-auto px-2">
          A sanctuary for the discerning eye. Explore a collection of objects
          defined by uncompromising craft and timeless silhouette.
        </p>
      </section>

      {/* Catalog */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-20">
        {/* Mobile filter toggle */}
        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          className="lg:hidden w-full flex items-center justify-between border border-store-border px-4 py-3 mb-6 text-xs uppercase tracking-[0.15em] text-store-fg"
        >
          <span>
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 text-store-subtle">
                ({activeFilterCount} active)
              </span>
            )}
          </span>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform",
              filtersOpen && "rotate-180"
            )}
          />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 lg:gap-16">
          <aside
            className={cn(
              "lg:sticky lg:top-24 lg:self-start",
              !filtersOpen && "hidden lg:block"
            )}
          >
            <FilterBar
              categories={categories}
              collections={collections}
              activeCategory={activeCategory}
              activeCollection={activeCollection}
              onCategoryChange={setActiveCategory}
              onCollectionChange={setActiveCollection}
            />
          </aside>

          <div className="min-w-0">
            {error && (
              <div className="mb-6 sm:mb-8 border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-24 sm:py-32 text-store-subtle gap-3">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs uppercase tracking-[0.15em]">
                  Loading
                </span>
              </div>
            ) : products.length === 0 ? (
              <div className="py-24 sm:py-32 text-center px-4">
                <p className="font-serif text-xl sm:text-2xl text-store-fg">
                  No objects found
                </p>
                <p className="text-sm text-store-subtle mt-3">
                  Adjust your filters or explore the full catalog.
                </p>
                {(activeCategory || activeCollection) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 text-xs uppercase tracking-[0.15em] text-store-fg underline underline-offset-4"
                  >
                    View entire catalog
                  </button>
                )}
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 gap-x-6 sm:gap-x-10">
                {products.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i}
                    className="mb-8 sm:mb-12"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {!loading && products.length > 0 && (activeCategory || activeCollection) && (
          <div className="mt-6 sm:mt-8 flex justify-center px-4">
            <button
              type="button"
              onClick={clearFilters}
              className="w-full sm:w-auto px-8 sm:px-10 py-3.5 border store-btn-outline text-[11px] uppercase tracking-[0.2em] transition-colors"
            >
              View Entire Catalog
            </button>
          </div>
        )}
      </div>

      {/* About anchor */}
      <section
        id="about"
        className="border-t border-store-border py-16 sm:py-20 px-4 sm:px-6 text-center max-w-2xl mx-auto"
      >
        <h2 className="font-serif text-xl sm:text-2xl text-store-fg mb-4">
          A Philosophy of Stillness
        </h2>
        <p className="text-sm text-store-muted leading-relaxed">
          Each piece in our catalog is selected for its quiet presence — objects
          that reward attention without demanding it. We believe in fewer,
          better things.
        </p>
      </section>
    </div>
  );
};

export default Home;
