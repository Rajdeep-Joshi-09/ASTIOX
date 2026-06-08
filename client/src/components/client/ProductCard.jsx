import { Link } from "react-router-dom";
import { imageUrl } from "@/lib/publicApi";
import { cn } from "@/lib/utils";

const ProductCard = ({ product, compact = false, className }) => {
  const img = imageUrl(
    product.images?.[0]?.imagePath || product.productImage
  );

  return (
    <Link
      to={`/product/${product.id}`}
      className={cn(
        "group flex flex-col bg-white border border-[#ddd] rounded-lg overflow-hidden hover:shadow-md transition-shadow h-full",
        compact ? "p-2" : "p-3",
        className
      )}
    >
      <div
        className={cn(
          "bg-[#f7f7f7] rounded flex items-center justify-center overflow-hidden",
          compact ? "aspect-square mb-2" : "aspect-square mb-3"
        )}
      >
        {img ? (
          <img
            src={img}
            alt={product.productName}
            className="max-w-full max-h-full object-contain p-2 group-hover:scale-[1.02] transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <span className="text-xs text-[#888]">No image</span>
        )}
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <h3
          className={cn(
            "text-[#0f1111] leading-snug group-hover:text-[#c7511f] transition-colors line-clamp-2",
            compact ? "text-xs" : "text-sm"
          )}
        >
          {product.productName}
        </h3>
        {!compact && product.categoryName && (
          <p className="text-xs text-[#565959] mt-1.5">{product.categoryName}</p>
        )}
        {!compact && product.collectionType && (
          <p className="text-[11px] text-[#007185] mt-auto pt-2">
            {product.collectionType}
          </p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
