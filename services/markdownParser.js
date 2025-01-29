const fs = require("fs");
const path = require("path");

class MarkdownParser {
  constructor() {}

  parse(mdText) {
    return (
      mdText
        .replace(/^###### (.*$)/gm, "<h6>$1</h6>")
        .replace(/^##### (.*$)/gm, "<h5>$1</h5>")
        .replace(/^#### (.*$)/gm, "<h4>$1</h4>")
        .replace(/^### (.*$)/gm, "<h3>$1</h3>")
        .replace(/^## (.*$)/gm, "<h2>$1</h2>")
        .replace(/^# (.*$)/gm, "<h1>$1</h1>")
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") 
        .replace(/\*(.*?)\*/g, "<i>$1</i>") 
        .replace(/~~(.*?)~~/g, "<del>$1</del>") 
        .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
        .replace(/`(.*?)`/g, "<code>$1</code>")
        .replace(/^> (.*$)/gm, "<blockquote>$1</blockquote>")
        .replace(/^---$/gm, "<hr>")
        .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
        .replace(/^\s*[-*]\s(.*$)/gm, "<li>$1</li>")
        .replace(/(<li>.*<\/li>)/g, "<ul>$1</ul>")
        .replace(/^\s*\d+\.\s(.*$)/gm, "<li>$1</li>")
        .replace(/(<li>.*<\/li>)/g, "<ol>$1</ol>")
        .replace(
          /\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.*\|\n)*)/g,
          (match, headers, rows) => {
            const headerHtml = headers
              .split("|")
              .map((h) => `<th>${h.trim()}</th>`)
              .join("");
            const rowsHtml = rows
              .split("\n")
              .map((row) =>
                row
                  ? `<tr>${row
                      .split("|")
                      .map((cell) => `<td>${cell.trim()}</td>`)
                      .join("")}</tr>`
                  : ""
              )
              .join("");
            return `<table><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table>`;
          }
        )
        .replace(/^([^<\n].*)$/gm, "<p>$1</p>")
    );
  }

  convertFile(inputFile, outputFile) {
    try {
      if (!fs.existsSync(inputFile)) {
        throw new Error(`Dosya bulunamadı: ${inputFile}`);
      }

      const mdContent = fs.readFileSync(inputFile, "utf-8");
      const htmlContent = this.parse(mdContent);
      fs.writeFileSync(outputFile, htmlContent);
      console.log(`✅ Dönüştürme tamamlandı: ${outputFile}`);
    } catch (error) {
      console.error("❌ Dosya işlemi sırasında hata oluştu:", error.message);
    }
  }
}

module.exports = MarkdownParser;
