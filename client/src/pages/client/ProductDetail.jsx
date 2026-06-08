import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, Loader2 } from "lucide-react";
import ImageGallery from "@/components/client/ImageGallery";
import HtmlContent from "@/components/client/HtmlContent";
import ProductRecommendations from "@/components/client/ProductRecommendations";
import { getPublicProduct } from "@/lib/publicApi";

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
      <div className="flex items-center justify-center min-h-[50vh] gap-2 text-[#565959]">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-[#0f1111]">{error || "Product not found"}</p>
        <Link to="/" className="text-sm text-[#007185] hover:text-[#c7511f] mt-4 inline-block">
          ← Back to catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-4 sm:py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-[#565959] mb-4 flex-wrap">
        <Link to="/" className="text-[#007185] hover:text-[#c7511f] hover:underline">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        {product.categoryName && (
          <>
            <span>{product.categoryName}</span>
            <ChevronRight className="w-3 h-3" />
          </>
        )}
        <span className="text-[#0f1111] line-clamp-1">{product.productName}</span>
      </nav>

      {/* Main product section — Amazon-style split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <ImageGallery images={product.images} productName={product.productName} />

        <div className="min-w-0">
          <h1 className="text-2xl sm:text-[28px] text-[#0f1111] font-normal leading-snug">
            {product.productName}
          </h1>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {product.categoryName && (
              <span className="text-[#007185]">
                Category: <span className="text-[#0f1111]">{product.categoryName}</span>
              </span>
            )}
            {product.collectionType && (
              <span className="text-[#007185]">
                Collection:{" "}
                <span className="text-[#0f1111]">
                  {product.collectionType}
                  {product.collectionLabel ? ` (${product.collectionLabel})` : ""}
                </span>
              </span>
            )}
          </div>

          <div className="mt-6 border-t border-[#e7e7e7] pt-6">
            <h2 className="text-lg font-normal text-[#0f1111] mb-4">About this item</h2>
            <div className="store-html-content text-[#0f1111] text-sm leading-relaxed">
              <HtmlContent html={product.productDescription} />
            </div>
          </div>
        </div>
      </div>

      <ProductRecommendations products={recommendations} />
    </div>
  );
};

export default ProductDetail;
