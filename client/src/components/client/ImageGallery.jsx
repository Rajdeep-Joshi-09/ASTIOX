import { useState } from "react";
import { imageUrl } from "@/lib/publicApi";
import { cn } from "@/lib/utils";

const ImageGallery = ({ images = [], productName }) => {
  const urls = images.length
    ? images.map((img) => imageUrl(img.imagePath || img))
    : [];

  const [active, setActive] = useState(0);

  if (!urls.length) {
    return (
      <div className="aspect-[4/5] sm:aspect-[3/4] bg-store-surface-2 flex items-center justify-center text-store-faint text-sm">
        No image available
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <div className="aspect-[4/5] sm:aspect-[3/4] bg-store-surface-2 overflow-hidden">
        <img
          src={urls[active]}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>

      {urls.length > 1 && (
        <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4 overflow-x-auto pb-1 -mx-1 px-1">
          {urls.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden bg-store-surface-2 transition-opacity",
                active === i ? "opacity-100 ring-1 ring-store-fg" : "opacity-50 hover:opacity-80"
              )}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
