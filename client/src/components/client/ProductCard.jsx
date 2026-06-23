import { Link } from "react-router-dom";
import { imageUrl } from "@/lib/publicApi";
import { cn } from "@/lib/utils";

const ProductCard = ({ product, compact = false, index = 0, className }) => {
  const img = imageUrl(
    product.images?.[0]?.imagePath || product.productImage
  );

  if (compact) {
    return (
      <Link
        to={`/product/${product.id}`}
        className={cn("group block", className)}
      >
        <div className="aspect-[3/4] bg-store-surface-2 overflow-hidden mb-3 border border-transparent group-hover:border-store-border transition-colors duration-500">
          {img ? (
            <img
              src={img}
              alt={product.productName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-store-faint">
              No image
            </div>
          )}
        </div>
        <h3 className="font-serif text-sm text-store-fg leading-snug group-hover:opacity-75 transition-opacity line-clamp-2">
          {product.productName}
        </h3>
      </Link>
    );
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className={cn("group block", className)}
    >
      <div className="bg-store-surface-2 overflow-hidden mb-3.5 sm:mb-4 aspect-[3/4] border border-transparent group-hover:border-store-border transition-colors duration-500">
        {img ? (
          <img
            src={img}
            alt={product.productName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-store-faint">
            No image
          </div>
        )}
      </div>

      <div className="space-y-1.5 px-0.5">
        {product.categoryName && (
          <p className="text-[9px] uppercase tracking-[0.25em] text-store-subtle font-medium">
            {product.categoryName}
          </p>
        )}
        <h3 className="font-serif text-base sm:text-lg text-store-fg leading-snug group-hover:opacity-70 transition-all duration-300">
          <span className="bg-left-bottom bg-gradient-to-r from-store-fg to-store-fg bg-[length:0%_1px] bg-no-repeat group-hover:bg-[length:100%_1px] transition-[background-size] duration-500 pb-0.5">
            {product.productName}
          </span>
        </h3>
      </div>
    </Link>
  );
};

export default ProductCard;
