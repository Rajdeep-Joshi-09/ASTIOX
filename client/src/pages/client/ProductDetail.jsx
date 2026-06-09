import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import ImageGallery from "@/components/client/ImageGallery";
import HtmlContent from "@/components/client/HtmlContent";
import ProductRecommendations from "@/components/client/ProductRecommendations";
import { getPublicProduct, imageUrl } from "@/lib/publicApi";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getPublicProduct(id);
        setProduct(res.data);
        setRecommendations(res.recommendations || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] gap-3 text-store-subtle">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-xs uppercase tracking-[0.15em]">Loading</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-20 sm:py-24 text-center">
        <p className="font-serif text-lg sm:text-xl text-store-fg">
          {error || "Object not found"}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-store-muted hover:text-store-fg mt-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Catalog
        </Link>
      </div>
    );
  }

  const editionNo = String(product.id).padStart(3, "0");
  const lifestyleImage = product.images?.[1]?.imagePath
    ? imageUrl(product.images[1].imagePath)
    : product.images?.[0]?.imagePath
      ? imageUrl(product.images[0].imagePath)
      : null;

  const specs = [
    product.categoryName && { label: "Category", value: product.categoryName },
    product.collectionType && {
      label: "Collection",
      value: product.collectionLabel
        ? `${product.collectionType} (${product.collectionLabel})`
        : product.collectionType,
    },
  ].filter(Boolean);

  return (
    <div>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 pb-12 sm:pb-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs text-store-muted hover:text-store-fg transition-colors mb-6 sm:mb-10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 sm:gap-12 lg:gap-20">
          <ImageGallery
            images={product.images}
            productName={product.productName}
          />

          <div className="lg:pt-4 min-w-0">
            <p className="text-[10px] uppercase tracking-[0.25em] text-store-subtle mb-3 sm:mb-4">
              Edition No. {editionNo}
            </p>

            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-store-fg font-normal leading-tight">
              {product.productName}
            </h1>

            <div className="mt-6 sm:mt-8 min-w-0">
              <HtmlContent html={product.productDescription} />
            </div>

            {specs.length > 0 && (
              <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-store-border">
                <h2 className="text-[11px] uppercase tracking-[0.2em] text-store-fg font-medium mb-4 sm:mb-5">
                  Specifications
                </h2>
                <dl className="space-y-3">
                  {specs.map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-8 text-sm border-b border-store-border pb-3 last:border-0 last:pb-0 sm:border-0 sm:pb-0"
                    >
                      <dt className="text-store-subtle shrink-0">{label}</dt>
                      <dd className="text-store-fg sm:text-right break-words">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <button
              type="button"
              className="mt-8 sm:mt-10 w-full py-3.5 sm:py-4 border store-btn-outline text-[11px] uppercase tracking-[0.2em] transition-colors"
            >
              Inquire for Details
            </button>

            <p className="mt-3 sm:mt-4 text-center text-[10px] uppercase tracking-[0.15em] text-store-faint px-2">
              Worldwide insured transportation available
            </p>
          </div>
        </div>
      </div>

      {/* Editorial section */}
      <section className="border-t border-store-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-store-fg mb-4 sm:mb-5">
                A Philosophy of Stillness
              </h2>
              <p className="text-sm text-store-muted leading-relaxed mb-5 sm:mb-6">
                Each object in our collection is chosen for its ability to
                transform space through restraint. We partner with artisans who
                share our belief that true luxury lies in the unhurried and the
                meticulously considered.
              </p>
              <Link
                to="/"
                className="text-xs uppercase tracking-[0.15em] text-store-fg underline underline-offset-4 hover:opacity-60 transition-opacity"
              >
                Explore the Collection
              </Link>
            </div>

            {lifestyleImage && (
              <div className="order-1 lg:order-2 aspect-[16/10] bg-store-surface-2 overflow-hidden">
                <img
                  src={lifestyleImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-20">
        <ProductRecommendations products={recommendations} />
      </div>
    </div>
  );
};

export default ProductDetail;
