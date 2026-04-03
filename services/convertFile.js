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
    if (!fontLink) return "Afacad";
    const hrefUrl = this.extractHref(fontLink);
    if (!hrefUrl) return "Afacad";
    try {
      const urlParams = new URL(hrefUrl).searchParams;
      const fontFamily = urlParams.get("family");
      return fontFamily ? fontFamily.split(":")[0].replace(/\+/g, " ") : "Afacad";
    } catch (e) {
      return "Afacad";
    }
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
      let hamburgerButton = ``;
      let hamburgerButtonHTML = ``;
      
      if (logoLink.length > 0) {
        logoHTML = `<div class="mb-8 flex justify-center lg:justify-start"><img src="${logoLink}" class="h-12 w-auto grayscale dark:invert opacity-80" alt="${title}" /></div>`;
      }
      if (template === "Navigation link") {
        sideBarHTML = returnSidebar(finalHtml, "Auto Height Sidebar");
        hamburgerButton = `
        <button id="openModal" class="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-primary transition-all active:scale-90" aria-label="Menu">
          <i class="bi bi-list text-2xl"></i>
        </button>`;
        hamburgerButtonHTML = `
        <div id="modal" class="fixed inset-0 z-[100] invisible">
            <div id="modal-backdrop" class="absolute inset-0 bg-black/20 backdrop-blur-sm opacity-0 transition-opacity duration-300"></div>
            <div id="modal-content" class="relative w-4/5 max-w-xs h-full bg-white dark:bg-slate-900 shadow-2xl p-6 -translate-x-full transition-transform duration-300 ease-out overflow-y-auto">
                <button id="closeModal" class="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-2xl transition-colors">&times;</button>
                <div class="mb-8 pt-4">
                  <h2 class="text-xl font-bold tracking-tight">${title}</h2>
                  <p class="text-sm text-secondary pt-1">Documentation</p>
                </div>
                <div id="mobile-sidebar">
                  ${sideBarHTML}
                </div>
            </div>
        </div>
        
        <script>
          document.addEventListener("DOMContentLoaded", () => {
            const openModal = document.getElementById("openModal");
            const closeModal = document.getElementById("closeModal");
            const modal = document.getElementById("modal");
            const backdrop = document.getElementById("modal-backdrop");
            const content = document.getElementById("modal-content");
            
            function toggleMenu(isOpen) {
              const icon = openModal.querySelector('i');
              if (isOpen) {
                modal.classList.remove("invisible");
                document.body.style.overflow = 'hidden';
                if (icon) {
                  icon.classList.remove("bi-list");
                  icon.classList.add("bi-x-lg");
                }
                setTimeout(() => {
                  backdrop.classList.add("opacity-100");
                  content.classList.remove("-translate-x-full");
                }, 10);
              } else {
                backdrop.classList.remove("opacity-100");
                content.classList.add("-translate-x-full");
                document.body.style.overflow = '';
                if (icon) {
                  icon.classList.remove("bi-x-lg");
                  icon.classList.add("bi-list");
                }
                setTimeout(() => {
                  modal.classList.add("invisible");
                }, 300);
              }
            }
            
            openModal?.addEventListener("click", () => toggleMenu(true));
            closeModal?.addEventListener("click", () => toggleMenu(false));
            backdrop?.addEventListener("click", () => toggleMenu(false));
          });
        </script>
        `;
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
        bodyClasses = "theme-light";
        headScript = `
          <script>
            document.documentElement.classList.remove("dark");
            localStorage.setItem("color-theme", "light");
          </script>  
        `;
      }
      if (theme === "Dark") {
        bodyClasses = "dark theme-dark";
        headScript = `
          <script>
            document.documentElement.classList.add("dark");
            localStorage.setItem("color-theme", "dark");
          </script>  
        `;
      }
      if (theme === "Light and Dark") {
        bodyClasses = "";
        themeToggle = `
          <div class="floating-controls">
            <button id="theme-toggle" class="control-btn hover:scale-110 active:scale-95 transition-all">
              <i id="theme-toggle-icon" class="bi bi-sun text-2xl"></i>
            </button>
            ${socialMediasNavbarHTML}
          </div>`;
        themeScript = `
          const toggleButton = document.getElementById("theme-toggle");
          const toggleIcon = document.getElementById("theme-toggle-icon");
          function updateIcon() {
            if (document.documentElement.classList.contains("dark")) {
              toggleIcon.classList.remove("bi-sun");
              toggleIcon.classList.add("bi-moon-stars");
            } else {
              toggleIcon.classList.remove("bi-moon-stars");
              toggleIcon.classList.add("bi-sun");
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
          <div class="flex justify-between gap-2 bg-white text-black dark:bg-black dark:text-white rounded-md shadow-md p-3 fixed top-4 right-4 p-2 z-[40]">
            ${hamburgerButton}
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
    
      if (template === "Basic") {
        const templatePath = path.join(__dirname, "..","consts", "templates", "basic.html");        
        if (fs.existsSync(templatePath)) {
          let templateContent = fs.readFileSync(templatePath, "utf-8");
          finalHtml = templateContent.replace(
            '<div id="app"></div>',
            `<div id="app" class="w-full mx-auto p-8 lg:p-16 my-12 relative">
                <div class="prose prose-slate dark:prose-invert max-w-none">
                  ${htmlContent}
                </div>
                ${logoHTML} ${toggleHTML} ${authorHTML} ${
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
                '<main id="content" class="mb-12"></main>',
                `<main id="content" class="mb-12 relative">
                  <div class="prose prose-slate dark:prose-invert max-w-none">
                    ${htmlContent}
                  </div>
                  ${logoHTML} ${toggleHTML} ${authorHTML} ${
                    socialMediaType !== "Header Static Icon" ? socialMediasHTML : ""
                } ${sourceLinksHTML} ${hamburgerButtonHTML}</main>`
            );
            finalHtml = finalHtml.replace(
                '<div id="sidebar" class="hidden lg:block glass overflow-y-auto"></div>',
                `<aside id="sidebar" class="hidden lg:block glass overflow-y-auto px-6 py-8">${sideBarHTML}</aside>`
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

      // Inject Footer (Hardcoded in logic to prevent easy removal from templates)
      const footerHTML = `
        <div class="mt-16 mb-10 py-8 border-t border-gray-100 dark:border-gray-800">
          <p class="text-center text-sm text-secondary opacity-70">
            MADE WITH ❤️ BY 
            <a href="https://www.mdtoweb.osmanbeyhan.com/" class="text-accent hover:underline font-bold tracking-widest uppercase ml-1">MDtoWeb</a>
          </p>
        </div>
      `;
      doc.body.insertAdjacentHTML("beforeend", footerHTML);

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
