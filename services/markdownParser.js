import fs from "fs";
import path from "path";

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

  convertFile(inputFile, outputFile, template, mulitLang, languages) {
    try {
      if (!fs.existsSync(inputFile)) {
        throw new Error(`🙅 File not found: ${inputFile}`);
      }
      
      const mdContent = fs.readFileSync(inputFile, "utf-8");
      const htmlContent = this.parse(mdContent);
      
      let finalHtml = htmlContent;
      if (template === "Basic") {
        const templatePath = path.join("consts/themes/basic.html");
        if (fs.existsSync(templatePath)) {
          let templateContent = fs.readFileSync(templatePath, "utf-8");
          finalHtml = templateContent.replace("<div id=\"app\"></div>", `<div id=\"app\">${htmlContent}</div>`);
        } else {
          throw new Error("🙅 Template file not found");
        }
      }
      
      fs.writeFileSync(outputFile, finalHtml);
      console.log(`🚀 Success created: ${outputFile}`);
    } catch (error) {
      console.error("❌ An error occurred during the process:", error.message);
    }
  }
}

export default MarkdownParser;