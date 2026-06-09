import { useMemo } from "react";
import DOMPurify from "dompurify";
import { prepareProductHtml, cleanEditorHtml } from "@/lib/htmlUtils";
import { cn } from "@/lib/utils";

const CKEDITOR_ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "br", "hr",
  "strong", "b", "em", "i", "u", "s", "del", "sub", "sup",
  "ul", "ol", "li",
  "blockquote", "pre", "code",
  "a", "img", "span", "div",
  "figure", "figcaption",
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "colgroup", "col",
];

const CKEDITOR_ALLOWED_ATTR = [
  "href", "target", "rel", "src", "alt", "title",
  "width", "height", "style", "class",
  "colspan", "rowspan", "scope",
  "border", "cellpadding", "cellspacing", "align", "valign",
];

const PURIFY_CONFIG = {
  ALLOWED_TAGS: CKEDITOR_ALLOWED_TAGS,
  ALLOWED_ATTR: CKEDITOR_ALLOWED_ATTR,
};

export const sanitizeProductHtml = (html) => {
  let prepared = prepareProductHtml(html);
  if (!prepared) return "";

  let clean = DOMPurify.sanitize(prepared, PURIFY_CONFIG);

  if (/&lt;\/?[a-z]/i.test(clean)) {
    prepared = prepareProductHtml(clean);
    clean = DOMPurify.sanitize(prepared, PURIFY_CONFIG);
  }

  return cleanEditorHtml(clean);
};

const HtmlContent = ({ html, className }) => {
  const clean = useMemo(() => sanitizeProductHtml(html), [html]);

  if (!clean) {
    return (
      <p className="text-store-subtle italic text-sm">No description available.</p>
    );
  }

  return (
    <div
      className={cn("product-html-content", className)}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
};

export default HtmlContent;
