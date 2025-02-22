import { JSDOM } from "jsdom";

export function returnAutoHeightSideBar(content) {
  // JSDOM ile sanal DOM oluştur
  const dom = new JSDOM(`<!DOCTYPE html><html><body>${content}</body></html>`);
  const document = dom.window.document;

  // Başlıkları (h1-h6) al
  const headings = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")];

  // Türkçe karakterleri slugify yap
  function slugify(text) {
    return text.toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
  }

  // Başlıkları a etiketiyle oluştur
  const transformedHeadings = headings.map((heading) => {
    const slug = slugify(heading.textContent);
    return `<a id="${slug}" href="#${slug}" class="block p-2 font-bold">${heading.textContent}</a>`;
  }).join("");

  return `
        <div class="flex flex-wrap gap-3 mt-12">
            <div class="relative">
                <div class="absolute mt-1 rounded-md w-48">
                    ${transformedHeadings}
                </div>
            </div>
        </div>
    `;
}
