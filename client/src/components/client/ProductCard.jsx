import { Link } from "react-router-dom";
import { imageUrl } from "@/lib/publicApi";
import { cn } from "@/lib/utils";

const ASPECT_PATTERNS = [
  "aspect-square",
  "aspect-[3/5]",
  "aspect-[4/5]",
  "aspect-[5/4]",
  "aspect-square",
  "aspect-[5/4]",
];

const ProductCard = ({ product, compact = false, index = 0, className }) => {
  const img = imageUrl(
    product.images?.[0]?.imagePath || product.productImage
  );
  const aspect = ASPECT_PATTERNS[index % ASPECT_PATTERNS.length];

  if (compact) {
    return (
      <Link
        to={`/product/${product.id}`}
        className={cn("group block", className)}
      >
        <div className="aspect-square bg-store-surface-2 overflow-hidden mb-3">
          {img ? (
            <img
              src={img}
              alt={product.productName}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-store-faint">
              No image
            </div>
          )}
        </div>
        <h3 className="font-serif text-sm text-store-fg leading-snug group-hover:opacity-60 transition-opacity line-clamp-2">
          {product.productName}
        </h3>
      </Link>
    );
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className={cn("group block break-inside-avoid", className)}
    >
      <div
        className={cn(
          "bg-store-surface-2 overflow-hidden mb-3 sm:mb-4",
          aspect,
          index % 2 === 1 && "sm:mt-12 md:mt-20"
        )}
      >
        {img ? (
          <img
            src={img}
            alt={product.productName}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-store-faint">
            No image
          </div>
        )}
      </div>

      <div className="space-y-1">
        {product.categoryName && (
          <p className="text-[10px] uppercase tracking-[0.2em] text-store-subtle">
            {product.categoryName}
          </p>
        )}
        <h3 className="font-serif text-base sm:text-lg text-store-fg leading-snug group-hover:opacity-60 transition-opacity">
          {product.productName}
        </h3>
      </div>
    </Link>
  );
};

export default ProductCard;
