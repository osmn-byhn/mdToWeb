import fs from "fs";
import path from "path";
import { MarkdownParser } from "./MarkdownParser.js";
import pkg from "js-beautify";
import { JSDOM } from "jsdom";
const { html: beautifyHtml } = pkg;
import { returnSocialMedia } from "../consts/components/socialMediaIcons/index.js";
import { returnSidebar } from "../consts/components/sidebars/index.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export class FileConverter {
  constructor() {
    this.parser = new MarkdownParser();
  }
  extractHref(linkTag) {
    const match = linkTag.match(/href="([^"]+)"/);
    return match ? match[1] : null;
  }
  getFontFamilyFromLink(fontLink) {
    const hrefUrl = this.extractHref(fontLink)
    const urlParams = new URL(hrefUrl).searchParams;
    const fontFamily = urlParams.get("family");    
    return fontFamily ? fontFamily.split(":")[0].replace(/\+/g, " ") : null;
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
    socialMediaType,
    sourceLinks,
    socialLinks,
    logoLink,
    iconLink,
    fontLink
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
      let socialMediasNavbarHTML = "";
      let sourceLinksHTML = "";
      let headScript = "";
      let logoHTML = "";
      let sideBarHTML = "";
      
      if (logoLink.length > 0) {
        logoHTML = `<img src="${logoLink}" class="h-[4rem] w-auto absolute top-4 left-4 p-2" alt="${title}" />`;
      }
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
      if (links === true) {
        socialMediasHTML = returnSocialMedia(socialLinks, socialMediaType);
        if (socialMediaType === "Header Static Icon") {
          socialMediasHTML = returnSocialMedia(socialLinks, socialMediaType);
          socialMediasNavbarHTML = socialMediasHTML;
        }
      } else {
        socialMediasHTML = "";
      }
      if (theme === "Light") {
        bodyClasses = "bg-gray-100 text-black";
        headScript = `
          <script>
            if (localStorage.getItem("color-theme") === "light" || (!("color-theme" in localStorage) && window.matchMedia("(prefers-color-scheme: light)").matches)) {
              document.documentElement.classList.add("light");
            } else {
              document.documentElement.classList.remove("light");
            }
          </script>  
        `;
      }
      if (theme === "Dark") {
        bodyClasses = "bg-gray-900 text-white";
        headScript = `
          <script>
            if (localStorage.getItem("color-theme") === "dark" || (!("color-theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
              document.documentElement.classList.add("dark");
            } else {
              document.documentElement.classList.remove("dark");
            }
          </script>  
        `;
      }
      if (theme === "Light and Dark") {
        bodyClasses = "bg-white text-black dark:bg-gray-900 dark:text-white";
        themeToggle = `
          <div class="flex justify-between gap-2 bg-white text-black dark:bg-black dark:text-white rounded-md shadow-md p-3 fixed top-4 right-4 p-2 z-[50]">
            ${socialMediasNavbarHTML}
            <i id="theme-toggle" class="bi bi-sun text-xl"></i>
          </div>`;
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
        headScript = `
          <script>
            if (localStorage.getItem("color-theme") === "dark" || (!("color-theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
              document.documentElement.classList.add("dark");
            } else {
              document.documentElement.classList.remove("dark");
            }
          </script>  
        `;
      }

      if (multiLang === true) {
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
            ${socialMediasNavbarHTML}
            ${
              theme === "Light and Dark"
                ? '<i id="theme-toggle" class="bi bi-sun text-xl"></i>'
                : ""
            }
            <select id="language-select" class="bg-transparent text-black dark:text-white text-xl">
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
    if (template  === "Navigation link") {
      sideBarHTML = returnSidebar(finalHtml, "Auto Height Sidebar");      
    }
      if (template === "Basic") {
        const templatePath = path.join(__dirname, "..","consts", "templates", "basic.html");        
        if (fs.existsSync(templatePath)) {
          let templateContent = fs.readFileSync(templatePath, "utf-8");
          finalHtml = templateContent.replace(
            '<div id="app"></div>',
            `<div id="app" class="w-[95%] lg:max-w-[1140px] mx-auto bg-white dark:bg-black rounded-md shadow-xl p-5 mt-[12vh]">${htmlContent} ${logoHTML} ${toggleHTML} ${authorHTML} ${
              socialMediaType !== "Header Static Icon" ? socialMediasHTML : ""
            } ${sourceLinksHTML} </div>`
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
        const templatePath = path.join(__dirname, "..","consts", "templates", "navigation_link.html");
        if (fs.existsSync(templatePath)) {
            let templateContent = fs.readFileSync(templatePath, "utf-8");
            finalHtml = templateContent.replace(
                '<div id="content"></div>',
                `<div id="content" class="w-[95%] lg:max-w-[1140px] mx-auto bg-white dark:bg-black rounded-md shadow-xl p-5 mt-[12vh]">${htmlContent} ${logoHTML} ${toggleHTML} ${authorHTML} ${
                    socialMediaType !== "Header Static Icon" ? socialMediasHTML : ""
                } ${sourceLinksHTML}</div>`
            );
            finalHtml = finalHtml.replace(
                '<div id="sidebar"></div>',
                `<div id="sidebar" class="w-[95%] lg:w-2/3 mx-auto bg-white dark:bg-black rounded-md shadow-xl p-5 mt-[12vh] lg:ml-12 lg:mr-12">${logoHTML} ${sideBarHTML} ${authorHTML} ${
                    socialMediaType !== "Header Static Icon" ? socialMediasHTML : ""
                } ${sourceLinksHTML}</div>`
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
        const templatePath =  path.join(__dirname, "..","consts", "templates", "navbar_and_footer.html");
        if (fs.existsSync(templatePath)) {
          let templateContent = fs.readFileSync(templatePath, "utf-8");
          finalHtml = templateContent.replace(
            '<div id="app"></div>',
            `<div id="app" class="w-[95%] lg:max-w-[1140px] mx-auto bg-white dark:bg-black rounded-md shadow-xl p-5 mt-[12vh]">${htmlContent} ${logoHTML} ${toggleHTML} ${authorHTML} ${
              socialMediaType !== "Header Static Icon" ? socialMediasHTML : ""
            } ${sourceLinksHTML}</div>`
          );
          finalHtml = finalHtml.replace(
            "<title></title>",
            `<title>${title}</title>`
          );
        } else {
          throw new Error("🙅 Template file not found");
        }
      }
      finalHtml = finalHtml.replace(
        `<link rel="shortcut icon" href="" type="image/x-icon">`,
        `<link rel="shortcut icon" href="${iconLink}" type="image/x-icon">`
      );
      
      finalHtml = finalHtml.replace(
        `<link href="https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">`,
        fontLink
      );
      finalHtml = finalHtml.replace(
        `font-family: "Afacad", serif;`,
        `font-family: "${this.getFontFamilyFromLink(fontLink)}", serif;`
      )
      
      
      const dom = new JSDOM(finalHtml);
      const doc = dom.window.document;
      doc.head.insertAdjacentHTML("beforeend", headScript);
      const updatedHtml = dom.serialize();
      const formattedHtml = beautifyHtml(updatedHtml, {
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
