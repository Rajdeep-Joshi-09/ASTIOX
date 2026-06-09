import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getPublicCollections, getPublicProducts, imageUrl } from "@/lib/publicApi";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [colRes, prodRes] = await Promise.all([
          getPublicCollections(),
          getPublicProducts(),
        ]);
        setCollections(colRes.data || []);
        setProducts(prodRes.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const previewForCollection = (collectionId) => {
    const item = products.find((p) => String(p.collectionId) === String(collectionId));
    return item ? imageUrl(item.images?.[0]?.imagePath || item.productImage) : null;
  };

  const countForCollection = (collectionId) =>
    products.filter((p) => String(p.collectionId) === String(collectionId)).length;

  return (
    <div>
      <section className="text-center px-4 sm:px-6 py-12 sm:py-16 md:py-20 max-w-3xl mx-auto">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-store-fg font-normal leading-tight">
          Collections
        </h1>
        <p className="mt-4 sm:mt-6 text-sm md:text-[15px] text-store-muted leading-relaxed max-w-xl mx-auto">
          Curated groupings of objects united by material, era, and design
          philosophy. Explore each collection at your own pace.
        </p>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-20">
        {error && (
          <div className="mb-8 border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24 text-store-subtle gap-3">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs uppercase tracking-[0.15em]">Loading</span>
          </div>
        ) : collections.length === 0 ? (
          <p className="text-center text-store-muted py-20">No collections available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {collections.map((col) => {
              const preview = previewForCollection(col.id);
              const count = countForCollection(col.id);

              return (
                <Link
                  key={col.id}
                  to={`/?collection=${col.id}`}
                  className="group block"
                >
                  <div className="aspect-[4/5] bg-store-surface-2 overflow-hidden mb-4">
                    {preview ? (
                      <img
                        src={preview}
                        alt={col.collectionType}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-store-faint text-xs uppercase tracking-[0.15em]">
                        Collection
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-store-subtle mb-1">
                    {count} {count === 1 ? "object" : "objects"}
                  </p>
                  <h2 className="font-serif text-xl text-store-fg group-hover:opacity-60 transition-opacity">
                    {col.collectionType}
                  </h2>
                  {col.inputField && (
                    <p className="text-sm text-store-muted mt-1">{col.inputField}</p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;
