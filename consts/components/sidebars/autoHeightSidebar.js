import { JSDOM } from "jsdom";

export function returnAutoHeightSideBar(content) {
  const dom = new JSDOM(`<!DOCTYPE html><html><body>${content}</body></html>`);
  const document = dom.window.document;
  const headings = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")];

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

  let html = '<ul class="p-2 space-y-2">';
  let stack = [{ level: 0, html: "" }]; // Stack başlangıç seviyesi
  
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.replace("H", ""), 10);
    const slug = slugify(heading.textContent);
    const listItem = `<li><a id="${slug}" href="#${slug}" class="block p-2 font-bold whitespace-nowrap">${heading.textContent}</a>`;

    while (stack.length && stack[stack.length - 1].level >= level) {
      let last = stack.pop();
      stack[stack.length - 1].html += `<ul class='ml-4 space-y-1 bg-transparent'>${last.html}</ul>`;
    }

    stack.push({ level, html: listItem });
  });

  while (stack.length > 1) {
    let last = stack.pop();
    stack[stack.length - 1].html += `<ul class='ml-4 space-y-1 bg-transparent'>${last.html}</ul>`;
  }

  html += stack[0].html + "</ul>";

  return `
        <div class="flex flex-wrap gap-3 mt-1">
            <div class="relative">
                <div class="absolute mt-1 rounded-md w-full p-2">
                    ${html}
                </div>
            </div>
        </div>
    `;
}
