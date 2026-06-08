import { cn } from "@/lib/utils";

const FilterBar = ({
  categories,
  collections,
  activeCategory,
  activeCollection,
  onCategoryChange,
  onCollectionChange,
  productCount,
}) => (
  <div className="bg-white border border-[#ddd] rounded-lg p-4 sm:p-5 space-y-4">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div>
        <h2 className="text-lg text-[#0f1111] font-normal">Results</h2>
        <p className="text-sm text-[#565959]">
          {productCount} {productCount === 1 ? "product" : "products"}
        </p>
      </div>
      {(activeCategory || activeCollection) && (
        <button
          type="button"
          onClick={() => {
            onCategoryChange("");
            onCollectionChange("");
          }}
          className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline text-left"
        >
          Clear filters
        </button>
      )}
    </div>

    <div>
      <p className="text-xs font-semibold text-[#0f1111] mb-2 uppercase tracking-wide">Category</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onCategoryChange("")}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm border transition-colors",
            !activeCategory
              ? "bg-[#232f3e] text-white border-[#232f3e]"
              : "bg-white text-[#0f1111] border-[#ddd] hover:border-[#999]"
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onCategoryChange(String(cat.id))}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm border transition-colors",
              activeCategory === String(cat.id)
                ? "bg-[#232f3e] text-white border-[#232f3e]"
                : "bg-white text-[#0f1111] border-[#ddd] hover:border-[#999]"
            )}
          >
            {cat.categoryName}
          </button>
        ))}
      </div>
    </div>

    <div>
      <p className="text-xs font-semibold text-[#0f1111] mb-2 uppercase tracking-wide">Collection</p>
      <select
        value={activeCollection}
        onChange={(e) => onCollectionChange(e.target.value)}
        className="h-9 px-3 rounded border border-[#888] bg-[#f0f2f2] text-sm text-[#0f1111] focus:outline-none focus:ring-1 focus:ring-[#e77600] min-w-[220px]"
      >
        <option value="">All Collections</option>
        {collections.map((col) => (
          <option key={col.id} value={col.id}>
            {col.collectionType} — {col.inputField}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default FilterBar;
