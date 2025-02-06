import fs from "fs";
import path from "path";
import { MarkdownParser } from "./MarkdownParser.js";
import pkg from "js-beautify";
const { html: beautifyHtml } = pkg;
export class FileConverter {
  constructor() {
    this.parser = new MarkdownParser();
  }
  convertFile(
    inputFile,
    outputFile,
    template,
    multiLang,
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
      let htmlContent = this.parser.parse(mdContent);
      let finalHtml = htmlContent;
      let bodyClasses = "";
      let themeToggle = "";
      let authorHTML = "";
      let themeScript = "";
      let langScript = "";
      let socialMediasHTML = "";
      let sourceLinksHTML = "";
      if (sourceLinks.length > 0) {
        sourceLinksHTML = `
          <div class="flex gap-2">
            ${sourceLinks
              .map(
                (source) =>
                  `<a href="${source.url}" target="_blank" class="">
                    <i class="bi bi-link-45deg"></i>
                    <span class="">${source.name}</span>
                  </a>`
              )
              .join("")}
          </div>`;
      } else {
        sourceLinksHTML = "";
      }
      if (socialMedia.length > 0) {
        socialMediasHTML = `
          <div class="flex gap-2">
            ${socialMedia
              .map(
                (social) =>
                  `<a href="${social.url}" target="_blank" class=" flex gap-2">
                    <i class="bi ${social.icon} "></i>
                    <span class="">${social.name}</span>
                  </a>`
              )
              .join("")}
          </div>`;
      } else {
        socialMediasHTML = "";
      }
      if (theme === "Light") {
        bodyClasses = "bg-gray-100 text-black";
      }
      if (theme === "Dark") {
        bodyClasses = "bg-gray-900 text-white";
      }
      if (theme === "Light and Dark") {
        bodyClasses = "bg-white text-black dark:bg-gray-900 dark:text-white";
        themeToggle = `<i id="theme-toggle" class="bi bi-sun bg-white text-black dark:bg-black dark:text-white rounded-md shadow-md p-3 fixed top-4 right-4 p-2 text-xl z-[50]"></i>`;
        themeScript = `
          const toggleButton = document.getElementById("theme-toggle");
          function updateIcon() {
            if (document.documentElement.classList.contains("dark")) {
              toggleButton.classList.remove("bi-moon");
              toggleButton.classList.add("bi-sun");
            } else {
              toggleButton.classList.remove("bi-sun");
              toggleButton.classList.add("bi-moon");
            }
          }
          updateIcon();
          toggleButton?.addEventListener("click", () => {
            document.documentElement.classList.toggle("dark");
            const isDarkMode = document.documentElement.classList.contains("dark");
            localStorage.setItem("color-theme", isDarkMode ? "dark" : "light");
            updateIcon();
          });
        `;
      }
      if (typeof multiLang !== "undefined" && multiLang) {
        let langOptions = languages
          .map(
            (lang, index) =>
              `<option value="${lang.langCode}" ${
                index === 0 ? "selected" : ""
              }>${lang.langCode}</option>`
          )
          .join("");

        themeToggle = `
          <div class="flex justify-between gap-2 bg-white text-black dark:bg-black dark:text-white rounded-md shadow-md p-3 fixed top-4 right-4 p-2 z-[50]">
            ${
              theme === "Light and Dark"
                ? '<i id="theme-toggle" class="bi bi-sun text-xl"></i>'
                : ""
            }
            <select id="language-select" class="text-black dark:text-white text-xl">
              ${langOptions}
            </select>
          </div>`;
        langScript = `
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
            });`;
        htmlContent = `${languages
          .map(
            (lang, index) =>
              `<div lang="${lang.langCode}" class="lang-content ${
                index !== 0 ? "hidden" : ""
              }">${this.parser.parse(
                fs.readFileSync(lang.filePath, "utf-8")
              )}</div>`
          )
          .join("")}`;
      }
      if (theme === "Light and Dark") {
        themeToggle = `
          <div class="flex justify-between gap-2 bg-white text-black dark:bg-black dark:text-white rounded-md shadow-md p-3 fixed top-4 right-4 p-2 z-[50]">
          <i id="theme-toggle" class="bi bi-sun text-xl"></i>
          </div>`;
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
          ${langScript}
          document.querySelector(".copy-btn")?.addEventListener("click", function () {
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
        const templatePath = path.join("consts/templates/basic.html");
        if (fs.existsSync(templatePath)) {
          let templateContent = fs.readFileSync(templatePath, "utf-8");
          finalHtml = templateContent.replace(
            '<div id="app"></div>',
            `<div id="app" class="w-full lg:max-w-[1140px] mx-auto bg-white dark:bg-black rounded-md shadow-xl p-5">${htmlContent} ${toggleHTML} ${authorHTML} ${socialMediasHTML} ${sourceLinksHTML} </div>`
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
        const templatePath = path.join("consts/templates/navigation_link.html");
        if (fs.existsSync(templatePath)) {
          let templateContent = fs.readFileSync(templatePath, "utf-8");
          finalHtml = templateContent.replace(
            '<div id="app"></div>',
            `<div id="app" class="w-full lg:max-w-[1140px] mx-auto bg-white dark:bg-black rounded-md shadow-xl p-5">${htmlContent} ${toggleHTML} ${authorHTML} ${socialMediasHTML} ${sourceLinksHTML}</div>`
          );
          finalHtml = finalHtml.replace(
            "<title></title>",
            `<title>${title}</title>`
          );
        } else {
          throw new Error("🙅 Template file not found");
        }
      }
      finalHtml = finalHtml.replace("<body>", `<body class="${bodyClasses}">`);

      if (template === "Navigation, Navbar and Footer") {
        const templatePath = path.join(
          "consts/templates/navbar_and_footer.html"
        );
        if (fs.existsSync(templatePath)) {
          let templateContent = fs.readFileSync(templatePath, "utf-8");
          finalHtml = templateContent.replace(
            '<div id="app"></div>',
            `<div id="app" class="w-full lg:max-w-[1140px] mx-auto bg-white dark:bg-black rounded-md shadow-xl p-5">${htmlContent} ${toggleHTML} ${authorHTML} ${socialMediasHTML} ${sourceLinksHTML}</div>`
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
        "inputFile",
        inputFile,
        "outputFile",
        outputFile,
        "template",
        template,
        "multiLang",
        multiLang,
        "languages",
        languages,
        "title",
        title,
        "author",
        author,
        "theme",
        theme,
        "links",
        links,
        "sourceLinks",
        sourceLinks,
        "socialMedia",
        socialMedia
      );
      const formattedHtml = beautifyHtml(finalHtml, {
        indent_size: 2,
        wrap_line_length: 80,
      });
      fs.writeFileSync(outputFile, formattedHtml);
      console.log(`🚀 Success created: ${outputFile}`);
    } catch (error) {
      console.error("❌ An error occurred during the process:", error.message);
    }
  }
}
