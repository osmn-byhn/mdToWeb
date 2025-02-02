export class MarkdownParser {
  constructor() {}

  parse(mdText) {
    return mdText
      .replace(
        /^###### (.*)$/gm,
        "<h6 class='text-md font-normal my-1'>$1</h6>"
      )
      .replace(/^##### (.*)$/gm, "<h5 class='text-md font-normal my-1'>$1</h5>")
      .replace(/^#### (.*)$/gm, "<h4 class='text-lg font-normal my-1'>$1</h4>")
      .replace(/^### (.*)$/gm, "<h3 class='text-xl font-semibold my-1'>$1</h3>")
      .replace(/^## (.*)$/gm, "<h2 class='text-2xl font-bold my-1'>$1</h2>")
      .replace(/^# (.*)$/gm, "<h1 class='text-3xl font-bold my-1'>$1</h1>")
      .replace(/\*\*(.*?)\*\*/g, "<b class='font-bold'>$1</b>")
      .replace(/\*(.*?)\*/g, "<i class='italic'>$1</i>")
      .replace(/~~(.*?)~~/g, "<del class='line-through'>$1</del>")
      .replace(
        /```(\w+)\n([\s\S]*?)```/g,
        "<div class='code-container relative rounded-lg p-4 overflow-auto mt-2'>" +
          "<button class='copy-btn absolute top-3 right-3 bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-3 py-1 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition m-[25px] z-[10]'>" +
          "<i id='copyBtn' class='bi bi-clipboard'></i></button>" +
          "<pre class='line-numbers'><code class='language-$1'>$2</code></pre></div>"
      )
      .replace(/`(.*?)`/g, "<code class='bg-gray-200 px-1 rounded'>$1</code>")
      .replace(
        /^> (.*$)/gm,
        "<blockquote class='border-l-4 border-gray-500 pl-4 italic'>$1</blockquote>"
      )
      .replace(/^---$/gm, "<hr class='border-gray-300 my-4'>")
      .replace(
        /!\[(.*?)(?:\s=\s*(\d+)x(\d+))?\]\((.*?)\)/g,
        (match, alt, width, height, src) => {
          const widthAttr = width ? ` width='${width}px'` : "";
          const heightAttr = height ? ` height='${height}px'` : "";
          return `<img class='rounded-md my-2' src='${src}' alt='${alt}'${widthAttr}${heightAttr}>`;
        }
      )
      .replace(
        /\[(.*?)\]\((.*?)\)/g,
        "<a class='text-blue-500 hover:underline' href='$2'>$1</a>"
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
      .replace(/(<li.*?<\/li>)/gs, "<ul class='list-disc pl-5'>$1</ul>")
      .replace(
        /(<ul class='list-disc pl-5'>\s*<li class="ml-\d+">.*?<\/li>)\s*<ul class='list-disc pl-5'>/gs,
        "<ul class='list-decimal pl-7'>$1"
      )
      .replace(/<\/ul>\n<ul class='list-disc pl-5'>/g, "")
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
                `<th class='p-2 border border-gray-700 bg-gray-800 text-white'>${h}</th>`
            )
            .join("\n");
          const rowsHtml = rows
            .trim()
            .split("\n")
            .map((row, index) => {
              const cells = row
                .split("|")
                .map((cell) => cell.trim())
                .filter((cell) => cell);
              if (!cells.length) return "";
              return `<tr class='${
                index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
              }'>
            ${cells
              .map(
                (cell) =>
                  `<td class='p-2 border border-gray-700 text-center'>${cell}</td>`
              )
              .join("\n")}
          </tr>`;
            })
            .join("\n");
          return `
          <div class='overflow-x-auto my-4'>
            <table class='table-auto w-full border border-gray-700'>
              <thead><tr>${headerHtml}</tr></thead>
              <tbody>${rowsHtml}</tbody>
            </table>
          </div>`;
        }
      );
  }
}
