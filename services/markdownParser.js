import fs from "fs";
import path from "path";
class MarkdownParser {
  constructor() {}
  parse(mdText) {
    return mdText
      .replace(/^###### (.*)$/gm, "<h6 class='text-md font-normal'>$1</h6>")
      .replace(/^##### (.*)$/gm, "<h5 class='text-md font-normal'>$1</h5>")
      .replace(/^#### (.*)$/gm, "<h4 class='text-lg font-normal'>$1</h4>")
      .replace(/^### (.*)$/gm, "<h3 class='text-xl font-semibold'>$1</h3>")
      .replace(/^## (.*)$/gm, "<h2 class='text-2xl font-bold'>$1</h2>")
      .replace(/^# (.*)$/gm, "<h1 class='text-3xl font-bold'>$1</h1>")
      .replace(/\*\*(.*?)\*\*/g, "<b class='font-normal'>$1</b>")
      .replace(/\*(.*?)\*/g, "<i class='font-normal italic'>$1</i>")
      .replace(/~~(.*?)~~/g, "<del class='font-normal line-through'>$1</del>")
      .replace(
        /```([\s\S]*?)```/g,
        "<div class='code-container relative rounded-lg p-4 overflow-auto mt-2'><button class='copy-btn absolute top-3 right-3 bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-3 py-1 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition m-[25px] z-[10]'><i id='copyBtn' class='bi bi-clipboard'></i></button><pre class='line-numbers'><code class='language-js'>$1</code></pre></div>"
      )
      .replace(/`(.*?)`/g, "<code class=''>$1</code>")
      .replace(/^> (.*$)/gm, "<blockquote class=''>$1</blockquote>")
      .replace(/^---$/gm, "<hr>")
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img class="" src="$2" alt="$1">')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a class="" href="$2">$1</a>')
      .replace(/^\s*[-*]\s(.*$)/gm, "<li class=''>$1</li>")
      .replace(/(<li>.*<\/li>)/g, "<ul class=''>$1</ul>")
      .replace(/^\s*\d+\.\s(.*$)/gm, "<li class=''>$1</li>")
      .replace(/(<li>.*<\/li>)/g, "<ol class=''>$1</ol>")
      .replace(
        /\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.*\|\n)*)/g,
        (match, headers, rows) => {
          const headerHtml = headers
            .split("|")
            .map((h) => `<th class='p-2 whitespace-nowrap'>${h.trim()}</th>`)
            .join("");
          const rowsHtml = rows
            .split("\n")
            .map((row, index) =>
              row
                ? `<tr class="${
                    index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
                  }">
                    ${row
                      .split("|")
                      .map(
                        (cell) => `<td class='p-2 whitespace-nowrap'>
                        <div class="font-medium text-gray-800 text-center">
                          ${cell.trim()}</div>
                        </td>`
                      )
                      .join("")}
                  </tr>`
                : ""
            )
            .join("");
          return `
            <div class='overflow-x-auto'>
              <table class='table-auto w-full'>
                <thead class='text-xs font-semibold uppercase text-gray-600 bg-gray-900 w-full'>
                  <tr class=''>
                    <div class='font-semibold text-center'>
                      ${headerHtml}
                    </div>  
                  </tr>
                </thead>
                <tbody class='text-sm border border-gray-700'>${rowsHtml}</tbody>
              </table>
            </div>`;
        }
      );
  }
  convertFile(
    inputFile,
    outputFile,
    template,
    mulitLang,
    languages,
    title,
    author,
    theme,
    links,
    sourceLinks,
    socialMedia
  ) {
    try {
      if (!fs.existsSync(inputFile)) {
        throw new Error(`🙅 File not found: ${inputFile}`);
      }
      const mdContent = fs.readFileSync(inputFile, "utf-8");
      let htmlContent = this.parse(mdContent);
      let finalHtml = htmlContent;
      let bodyClasses = "";
      let themeToggle = "";
      let authorHTML = "";
      let scriptCode = "";
      let themeScript = "";
      let copyCodeScript = "";
      let langScript = "";
      if (theme === "Light") {
        bodyClasses = "bg-gray-100 text-black";
      }
      if (theme === "Dark") {
        bodyClasses = "bg-gray-900 text-white";
      }
      if (theme === "Light and Dark") {
        bodyClasses = "bg-gray-900 text-white";
        themeToggle = `<i id="theme-toggle" class="bi bi-sun bg-white text-black dark:bg-black dark:text-white rounded-md shadow-md p-3 fixed top-4 right-4 p-2 text-xl z-[50]"></i>`;
        themeScript = `
        const toggleButton = document.getElementById("theme-toggle");
          toggleButton.addEventListener("click", () => {
            if (document.body.classList.contains("bg-white")) {
              document.body.classList.remove("bg-white", "text-black");
              document.body.classList.add("bg-gray-900", "text-white");
              toggleButton.classList.remove("bi-sun");
              toggleButton.classList.add("bi-moon");
            } else {
              document.body.classList.remove("bg-gray-900", "text-white");
              document.body.classList.add("bg-white", "text-black");
              toggleButton.classList.remove("bi-moon");
              toggleButton.classList.add("bi-sun");
            }
          });
          `;
      }

      if (mulitLang === true) {
        themeToggle = `
        <div class="flex justify-between gap-2 bg-white text-black dark:bg-black dark:text-white rounded-md shadow-md p-3 fixed top-4 right-4 p-2 z-[50]">
          <i id="theme-toggle" class="bi bi-sun text-xl"></i>
          <select id="language-select" class="text-black dark:text-white text-xl">
            ${languages
              .map(
                (lang, index) =>
                  `<option value="${lang.langCode}" ${
                    index === 0 ? "selected" : ""
                  }>${lang.langCode}</option>`
              )
              .join("")}
          </select>
        </div>`;
        scriptCode = `
        const languageSelect = document.getElementById("language-select");
        const langDivs = document.querySelectorAll(".lang-content");
        languageSelect.addEventListener("change", function () {
            const selectedLang = this.value;
            langDivs.forEach(div => {
              if (div.getAttribute("lang") === selectedLang) {
                div.classList.remove("hidden");
              } else {
                div.classList.add("hidden");
              }
            });
          });`
        htmlContent = `${languages
          .map(
            (lang, index) =>
              `<div lang="${lang.langCode}" class="lang-content ${
                index !== 0 ? "hidden" : ""
              }">${this.parse(fs.readFileSync(lang.filePath, "utf-8"))}</div>`
          )
          .join("")}`;
      }
      else {
        themeToggle = `
        <i id="theme-toggle" class="bi bi-sun bg-white text-black dark:bg-black dark:text-white rounded-md shadow-md p-3 fixed top-4 right-4 p-2 text-xl z-[50]"></i>`;
      }
      if (author !== "") {
        authorHTML = `<p class="text-right text-black dark:text-white">Author: ${author}</p>`;
      }
      if (theme === "Auto Theme") {
        bodyClasses = "bg-gray-100 text-black dark:bg-gray-900 dark:text-white";
      }
      let toggleHTML = `
      ${themeToggle}
      <script>
        document.addEventListener("DOMContentLoaded", function () {
          ${themeScript}
          ${scriptCode}
          document.querySelector(".copy-btn").addEventListener("click", function () {
            const code = document.querySelector("pre code").innerText;
            navigator.clipboard.writeText(code);
            const copyBtn = document.getElementById("copyBtn");
            copyBtn.classList.remove("bi-clipboard");
            copyBtn.classList.add("bi-clipboard-check");
          });
        });
      </script>
    `;
      if (template === "Basic") {
        const templatePath = path.join("consts/themes/basic.html");
        if (fs.existsSync(templatePath)) {
          let templateContent = fs.readFileSync(templatePath, "utf-8");
          finalHtml = templateContent.replace(
            '<div id="app"></div>',
            `<div id="app" class=" w-full lg:max-w-[800px] ">${htmlContent} ${toggleHTML} ${authorHTML}</div>`
          );
          finalHtml = finalHtml.replace(
            "<title></title>",
            `<title>${title}</title>`
          );
        } else {
          throw new Error("🙅 Template file not found");
        }
      }
      if (template === "Navigation link") {
        const templatePath = path.join("consts/themes/navigation_link.html");
        if (fs.existsSync(templatePath)) {
          let templateContent = fs.readFileSync(templatePath, "utf-8");
          finalHtml = templateContent.replace(
            '<div id="app"></div>',
            `<div id="app" class=" w-full lg:max-w-[800px] ">${htmlContent} ${toggleHTML} ${authorHTML}</div>`
          );
          finalHtml = finalHtml.replace(
            "<title></title>",
            `<title>${title}</title>`
          );
        } else {
          throw new Error("🙅 Template file not found");
        }
      }
      if (template === "Navigation, Navbar and Footer") {
        const templatePath = path.join("consts/themes/navbar_and_footer.html");
        if (fs.existsSync(templatePath)) {
          let templateContent = fs.readFileSync(templatePath, "utf-8");
          finalHtml = templateContent.replace(
            '<div id="app"></div>',
            `<div id="app" class=" w-full lg:max-w-[800px] ">${htmlContent} ${toggleHTML} ${authorHTML}</div>`
          );
          finalHtml = finalHtml.replace(
            "<title></title>",
            `<title>${title}</title>`
          );
        } else {
          throw new Error("🙅 Template file not found");
        }
      }
      console.log(
        inputFile,
        outputFile,
        template,
        mulitLang,
        languages,
        title,
        author,
        theme,
        links,
        sourceLinks,
        socialMedia
      );
      fs.writeFileSync(outputFile, finalHtml);
      console.log(`🚀 Success created: ${outputFile}`);
    } catch (error) {
      console.error("❌ An error occurred during the process:", error.message);
    }
  }
}
export default MarkdownParser;
