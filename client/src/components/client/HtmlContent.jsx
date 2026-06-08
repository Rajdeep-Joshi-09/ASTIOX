import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";

const HtmlContent = ({ html, className }) => {
  if (!html?.trim()) {
    return <p className="text-[#565959] italic">No description available.</p>;
  }

  const clean = DOMPurify.sanitize(html, {
    ADD_ATTR: ["target", "rel"],
    ALLOWED_TAGS: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "hr", "strong", "b", "em", "i", "u", "s",
      "ul", "ol", "li", "blockquote", "pre", "code",
      "a", "img", "span", "div", "table", "thead", "tbody", "tr", "th", "td",
    ],
  });

  return (
    <div
      className={cn("product-html-content", className)}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
};

export default HtmlContent;
