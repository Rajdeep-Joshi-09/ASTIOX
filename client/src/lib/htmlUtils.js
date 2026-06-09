export const decodeHtmlEntities = (html) => {
  if (typeof document === "undefined") return html;
  const textarea = document.createElement("textarea");
  textarea.innerHTML = html;
  return textarea.value;
};

export const prepareProductHtml = (html) => {
  if (!html?.trim()) return "";

  let value = html.trim();

  if (value.startsWith('"') && value.endsWith('"')) {
    try {
      value = JSON.parse(value);
    } catch {
      // keep original string
    }
  }

  for (let i = 0; i < 3; i++) {
    if (!/&(?:lt|gt|amp|quot|apos|#39|#x[0-9a-f]+|#\d+);/i.test(value)) {
      break;
    }
    const decoded = decodeHtmlEntities(value);
    if (decoded === value) break;
    value = decoded;
  }

  return value;
};

const THEME_BREAKING_STYLE_PROPS = new Set([
  "color",
  "background",
  "background-color",
  "background-image",
]);

const LAYOUT_BREAKING_STYLE_PROPS = new Set([
  "height",
  "min-height",
  "max-height",
]);

const isEmptyBlock = (el) => {
  const clone = el.cloneNode(true);
  clone.querySelectorAll("br").forEach((br) => br.remove());
  const text = (clone.textContent || "").replace(/\u00a0/g, " ").trim();
  const hasMedia = clone.querySelector("img, table, figure, hr, ul, ol, blockquote");
  return !text && !hasMedia;
};

const filterInlineStyles = (el, blockedProps) => {
  const kept = (el.getAttribute("style") || "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((decl) => {
      const prop = decl.split(":")[0]?.trim().toLowerCase();
      return prop && !blockedProps.has(prop);
    });

  if (kept.length) {
    el.setAttribute("style", `${kept.join("; ")};`);
  } else {
    el.removeAttribute("style");
  }
};

/** Remove CKEditor cruft that breaks storefront layout and themes. */
export const cleanEditorHtml = (html) => {
  if (!html?.trim() || typeof document === "undefined") return html;

  const doc = new DOMParser().parseFromString(
    `<div data-html-root>${html}</div>`,
    "text/html"
  );
  const root = doc.querySelector("[data-html-root]");
  if (!root) return html;

  root.querySelectorAll("[bgcolor]").forEach((el) => el.removeAttribute("bgcolor"));

  root.querySelectorAll("[style]").forEach((el) => {
    filterInlineStyles(el, new Set([...THEME_BREAKING_STYLE_PROPS, ...LAYOUT_BREAKING_STYLE_PROPS]));
  });

  root.querySelectorAll("img").forEach((img) => {
    img.removeAttribute("width");
    img.removeAttribute("height");
    filterInlineStyles(img, new Set([...THEME_BREAKING_STYLE_PROPS, ...LAYOUT_BREAKING_STYLE_PROPS, "width", "height"]));
  });

  root.querySelectorAll("table").forEach((table) => {
    table.removeAttribute("width");
    table.removeAttribute("height");
    table.removeAttribute("cellpadding");
    table.removeAttribute("cellspacing");
    filterInlineStyles(table, LAYOUT_BREAKING_STYLE_PROPS);
  });

  root.querySelectorAll("col, colgroup, tr, td, th").forEach((el) => {
    el.removeAttribute("width");
    el.removeAttribute("height");
    filterInlineStyles(el, LAYOUT_BREAKING_STYLE_PROPS);
  });

  root.querySelectorAll("p, div, h1, h2, h3, h4, h5, h6").forEach((el) => {
    if (isEmptyBlock(el)) {
      el.remove();
    }
  });

  return root.innerHTML;
};

export const stripThemeBreakingInlineStyles = (html) => cleanEditorHtml(html);
