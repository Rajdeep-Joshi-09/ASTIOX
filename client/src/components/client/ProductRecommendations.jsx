import ProductCard from "./ProductCard";

const ProductRecommendations = ({ products }) => {
  if (!products?.length) return null;

  return (
    <section className="mt-12 sm:mt-16 pt-10 sm:pt-12 border-t border-store-border">
      <h2 className="font-serif text-xl sm:text-2xl text-store-fg mb-8 sm:mb-10 text-center px-2">
        You May Also Appreciate
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-8">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} compact index={i} />
        ))}
      </div>
    </section>
  );
};

export default ProductRecommendations;
