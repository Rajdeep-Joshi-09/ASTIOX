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
      <div className="aspect-square bg-[#f7f7f7] border border-[#ddd] rounded flex items-center justify-center text-[#888] text-sm">
        No image available
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      {urls.length > 1 && (
        <div className="hidden sm:flex flex-col gap-2 w-14 shrink-0">
          {urls.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "aspect-square rounded border-2 overflow-hidden bg-white p-0.5 transition-all",
                active === i ? "border-[#c7511f] shadow-sm" : "border-[#ddd] hover:border-[#999]"
              )}
            >
              <img src={src} alt="" className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="aspect-square bg-white border border-[#ddd] rounded-lg overflow-hidden flex items-center justify-center p-4">
          <img
            src={urls[active]}
            alt={productName}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        {urls.length > 1 && (
          <div className="flex sm:hidden gap-2 mt-3 overflow-x-auto pb-1">
            {urls.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "w-14 h-14 shrink-0 rounded border-2 overflow-hidden bg-white",
                  active === i ? "border-[#c7511f]" : "border-[#ddd]"
                )}
              >
                <img src={src} alt="" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
