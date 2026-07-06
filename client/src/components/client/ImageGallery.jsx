import { useState, useEffect } from "react";
import { imageUrl } from "@/lib/publicApi";
import { cn } from "@/lib/utils";
import { Maximize2, Minimize2, X, ChevronLeft, ChevronRight } from "lucide-react";

const ImageGallery = ({ images = [], productName }) => {
  const urls = images.length
    ? images.map((img) => imageUrl(img.imagePath || img))
    : [];

  const [active, setActive] = useState(0);
  const [isFitMode, setIsFitMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scrolling when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!urls.length) {
    return (
      <div className="aspect-[4/5] sm:aspect-[3/4] bg-store-surface-2 flex items-center justify-center text-store-faint text-sm">
        No image available
      </div>
    );
  }

  const handlePrev = (e) => {
    e.stopPropagation();
    setActive((prev) => (prev === 0 ? urls.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActive((prev) => (prev === urls.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full min-w-0">
      <div className="relative aspect-[4/5] sm:aspect-[3/4] bg-store-surface-2 overflow-hidden flex items-center justify-center group/main">
        {/* Fit/Fill Toggle Button */}
        <button
          type="button"
          onClick={() => setIsFitMode(!isFitMode)}
          title={isFitMode ? "Switch to Fill View (crop to fit)" : "Switch to Fit View (show full image)"}
          className="absolute top-3 right-3 z-20 p-2 bg-store-bg/85 backdrop-blur-xs border border-store-border text-store-fg hover:bg-store-fg hover:text-store-bg transition-all duration-200 opacity-90 sm:opacity-0 sm:group-hover/main:opacity-100 focus:opacity-100 focus-visible:opacity-100 rounded-sm cursor-pointer shadow-md"
        >
          {isFitMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>

        {/* Ambient Blur Background (only in Fit Mode) */}
        {isFitMode && (
          <img
            src={urls[active]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-30 select-none pointer-events-none"
          />
        )}

        {/* Clickable Main Image */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full h-full cursor-zoom-in focus:outline-none flex items-center justify-center"
          title="Click to view fullscreen"
        >
          <img
            src={urls[active]}
            alt={productName}
            className={cn(
              "transition-all duration-300 select-none",
              isFitMode ? "max-w-full max-h-full object-contain p-2" : "w-full h-full object-cover"
            )}
          />
        </button>
      </div>

      {/* Thumbnails */}
      {urls.length > 1 && (
        <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4 overflow-x-auto pb-1 -mx-1 px-1">
          {urls.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden bg-store-surface-2 transition-opacity cursor-pointer",
                active === i ? "opacity-100 ring-1 ring-store-fg" : "opacity-50 hover:opacity-80"
              )}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-6 animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex justify-between items-center w-full text-zinc-400 select-none">
            <span className="text-[10px] uppercase tracking-widest font-mono">
              {active + 1} / {urls.length} — {productName}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 hover:text-white rounded-full transition-all cursor-pointer"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Main Image Area */}
          <div className="relative flex-1 flex items-center justify-center my-4">
            {urls.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-2 md:left-4 p-3 bg-zinc-900/60 hover:bg-zinc-800 text-white rounded-full transition-all cursor-pointer z-10 opacity-70 hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={urls[active]}
              alt={productName}
              className="max-w-full max-h-[75vh] md:max-h-[80vh] object-contain select-none shadow-2xl"
            />

            {urls.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-2 md:right-4 p-3 bg-zinc-900/60 hover:bg-zinc-800 text-white rounded-full transition-all cursor-pointer z-10 opacity-70 hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Footer Thumbnails */}
          {urls.length > 1 ? (
            <div className="flex justify-center gap-2 overflow-x-auto py-2">
              {urls.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={cn(
                    "w-12 h-12 md:w-16 md:h-16 shrink-0 overflow-hidden bg-zinc-900 border transition-all cursor-pointer",
                    active === i ? "border-white opacity-100" : "border-transparent opacity-40 hover:opacity-75"
                  )}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          ) : (
            <div className="h-4" />
          )}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
