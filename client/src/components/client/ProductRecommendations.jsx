import ProductCard from "./ProductCard";

const ProductRecommendations = ({ products }) => {
  if (!products?.length) return null;

  return (
    <section className="mt-12 pt-8 border-t border-[#ddd]">
      <h2 className="text-xl font-normal text-[#0f1111] mb-5">
        Products related to this item
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} compact />
        ))}
      </div>
    </section>
  );
};

export default ProductRecommendations;
