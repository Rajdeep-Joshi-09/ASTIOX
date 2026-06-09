import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const FilterBar = ({
  categories,
  collections,
  activeCategory,
  activeCollection,
  onCategoryChange,
  onCollectionChange,
}) => {
  const hasFilters = activeCategory || activeCollection;

  return (
    <div className="space-y-8 sm:space-y-10">
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-store-subtle mb-4 sm:mb-5">
          Category
        </p>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 lg:flex-col lg:gap-0 lg:space-y-3">
          <li>
            <button
              type="button"
              onClick={() => onCategoryChange("")}
              className={cn(
                "text-sm text-store-fg transition-opacity hover:opacity-60",
                !activeCategory && "underline underline-offset-4"
              )}
            >
              All Objects
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() => onCategoryChange(String(cat.id))}
                className={cn(
                  "text-sm text-store-fg transition-opacity hover:opacity-60",
                  activeCategory === String(cat.id) &&
                    "underline underline-offset-4"
                )}
              >
                {cat.categoryName}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-store-subtle mb-4 sm:mb-5">
          Collection
        </p>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 lg:flex-col lg:gap-0 lg:space-y-3">
          <li>
            <button
              type="button"
              onClick={() => onCollectionChange("")}
              className={cn(
                "text-sm text-store-fg transition-opacity hover:opacity-60",
                !activeCollection && "underline underline-offset-4"
              )}
            >
              All Collections
            </button>
          </li>
          {collections.map((col) => (
            <li key={col.id}>
              <button
                type="button"
                onClick={() => onCollectionChange(String(col.id))}
                className={cn(
                  "text-sm text-store-fg transition-opacity hover:opacity-60",
                  activeCollection === String(col.id) &&
                    "underline underline-offset-4"
                )}
              >
                {col.collectionType}
                {col.inputField ? ` — ${col.inputField}` : ""}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            onCategoryChange("");
            onCollectionChange("");
          }}
          className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-store-subtle hover:text-store-fg transition-colors"
        >
          <X className="w-3 h-3" />
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;
