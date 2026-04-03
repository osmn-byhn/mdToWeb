export class MarkdownParser {
  constructor() {}
  slugify(text) {
    return text
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9 -]/g, "") // Özel karakterleri temizle
      .replace(/\s+/g, "-") // Boşlukları tire ile değiştir
      .replace(/-+/g, "-"); // Fazla tireleri temizle
  }
  parse(mdText) {
    return mdText
      .replace(/^###### (.*)$/gm, (_, text) => {
        const id = this.slugify(text);
        return `<h6 id="${id}"><a href="#${id}">${text}</a></h6>`;
      })
      .replace(/^##### (.*)$/gm, (_, text) => {
        const id = this.slugify(text);
        return `<h5 id="${id}"><a href="#${id}">${text}</a></h5>`;
      })
      .replace(/^#### (.*)$/gm, (_, text) => {
        const id = this.slugify(text);
        return `<h4 id="${id}"><a href="#${id}">${text}</a></h4>`;
      })
      .replace(/^### (.*)$/gm, (_, text) => {
        const id = this.slugify(text);
        return `<h3 id="${id}"><a href="#${id}">${text}</a></h3>`;
      })
      .replace(/^## (.*)$/gm, (_, text) => {
        const id = this.slugify(text);
        return `<h2 id="${id}"><a href="#${id}">${text}</a></h2>`;
      })
      .replace(/^# (.*)$/gm, (_, text) => {
        const id = this.slugify(text);
        return `<h1 id="${id}"><a href="#${id}">${text}</a></h1>`;
      })
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/~~(.*?)~~/g, "<del>$1</del>")
      .replace(/```mermaid\n([\s\S]*?)```/g, '<div class="overflow-x-auto my-8 p-4 bg-slate-50 dark:bg-slate-900/50 border border-primary/20 rounded-2xl"><div class="mermaid flex justify-center text-center">$1</div></div>')
      .replace(
        /```(\w+)\n([\s\S]*?)```/g,
        "<div class='code-container relative rounded-2xl shadow-sm border border-primary overflow-hidden my-8'>" +
          "<div class='flex items-center justify-between px-6 py-3 bg-gray-50/50 dark:bg-gray-800/30 border-b border-primary'>" +
          "<span class='text-xs font-medium tracking-widest uppercase text-secondary'>$1</span>" +
          "<button class='copy-btn text-secondary hover:text-primary transition-all active:scale-90'>" +
          "<i id='copyBtn' class='bi bi-clipboard text-lg'></i></button></div>" +
          "<pre class='line-numbers !m-0 !bg-transparent !p-6'><code class='language-$1'>$2</code></pre></div>"
      )
      .replace(/`(.*?)`/g, "<code class='bg-secondary/10 text-primary px-1.5 py-0.5 rounded-md font-mono text-sm'>$1</code>")
      .replace(
        /^> (.*$)/gm,
        "<blockquote>$1</blockquote>"
      )
      .replace(/^---$/gm, "<hr class='my-12 border-primary'>")
      .replace(
        /!\[(.*?)(?:\s=\s*(\d+)x(\d+))?\]\((.*?)\)/g,
        (match, alt, width, height, src) => {
          const widthAttr = width ? ` width='${width}px'` : "";
          const heightAttr = height ? ` height='${height}px'` : "";
          return `<img class='rounded-2xl my-8 shadow-md' src='${src}' alt='${alt}'${widthAttr}${heightAttr}>`;
        }
      )
      .replace(/- \[(x|X| )\] (.+)/g, (_, checked, text) => {
        const isChecked = checked.trim().toLowerCase() === "x";
        return `<label class="flex items-center gap-3 my-2 cursor-pointer">
                  <input type="checkbox" disabled ${isChecked ? "checked" : ""} class="w-5 h-5 rounded border-primary text-accent focus:ring-accent">
                  <span class="text-secondary">${text}</span>
                </label>`;
      })
      .replace(
        /\[(.*?)\]\((.*?)\)/g,
        "<a href='$2'>$1</a>"
      )
      .replace(/^\s*[-*]\s(.*)$/gm, "<li>$1</li>")
      .replace(/^( *)([-*]) (.*)$/gm, (match, spaces, bullet, text) => {
        const level = spaces.length / 2;
        return `<li class="ml-${level * 4}">${text}</li>`;
      })
      .replace(/^( *)(\d+\.) (.*)$/gm, (match, spaces, num, text) => {
        const level = spaces.length / 2;
        return `<li class="ml-${level * 4}">${text}</li>`;
      })
      .replace(/(?:<li>.*<\/li>\s*)+/g, (match) => {
        return `<ul class='tree-list'>${match}</ul>`;
      })
      .replace(/<ul class='tree-list'>\s*(<li class="ml-\d+">.*?<\/li>)\s*<ul class='tree-list'>/g, "<ul>$1")
      .replace(/<\/ul>\s*<ul class='tree-list'>/g, "")
      .replace(
        /\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.*\|\n)*)/g,
        (match, headers, rows) => {
          const headerArray = headers
            .split("|")
            .map((h) => h.trim())
            .filter((h) => h);
          const headerHtml = headerArray
            .map(
              (h) =>
                `<th>${h}</th>`
            )
            .join("\n");
          const rowsHtml = rows
            .trim()
            .split("\n")
            .map((row) => {
              const cells = row
                .split("|")
                .map((cell) => cell.trim())
                .filter((cell) => cell);
              if (!cells.length) return "";
              return `<tr>
            ${cells
              .map(
                (cell) => {
                  // Detect paths and style them
                  const styledCell = cell.replace(
                      /((?:[\w.-]+\/)+[\w.-]+|(?:\/[\w.-]+)+)/g, 
                      `<span class='inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-accent/5 text-accent font-mono text-[0.85em] border border-accent/10'>
                        <i class='bi bi-folder2-open opacity-70'></i>
                        $1
                      </span>`
                  );
                  return `<td>${styledCell}</td>`;
                }
              )
              .join("\n")}
          </tr>`;
            })
            .join("\n");
          return `
          <div class='overflow-x-auto my-8 border-b border-primary/50'>
            <table class='!m-0 w-full text-left border-collapse'>
              <thead><tr class='border-b border-primary'>${headerHtml}</tr></thead>
              <tbody>${rowsHtml}</tbody>
            </table>
          </div>`;
        }
      )
  }
}
