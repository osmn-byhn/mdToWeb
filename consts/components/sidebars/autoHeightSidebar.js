import { JSDOM } from "jsdom";

export function returnAutoHeightSideBar(content) {
  const dom = new JSDOM(`<!DOCTYPE html><html><body>${content}</body></html>`);
  const document = dom.window.document;
  const headings = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")];
  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  const transformedHeadings = headings.map((heading) => {
    const slug = slugify(heading.textContent);
    const level = heading.tagName.substring(1);
    const fontSizeClass = level === '1' ? 'font-bold text-gray-900 dark:text-white' : 'font-medium';
    return `<a id="nav-${slug}" href="#${slug}" class="nav-link indent-${level} ${fontSizeClass}">${heading.textContent}</a>`;
  }).join("");

  return `
    <div class="space-y-1">
      ${transformedHeadings}
    </div>
  `;
}
