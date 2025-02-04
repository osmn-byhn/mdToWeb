import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";
import MDToWeb from "./services/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const languagesFile = path.join(__dirname, "consts", "languages.json");
const languages = JSON.parse(fs.readFileSync(languagesFile, "utf-8"));
const languageChoices = languages.map((lang) => ({
  name: lang.name,
  value: lang.code,
}));
const socialMediaPlatforms = [
  { name: "GitHub", value: "github", icon: "bi-github" },
  { name: "Twitter", value: "twitter", icon: "bi-twitter-x" },
  { name: "LinkedIn", value: "linkedin", icon: "bi-linkedin" },
  { name: "Facebook", value: "facebook", icon: "bi-facebook" },
  { name: "Instagram", value: "instagram", icon: "bi-instagram" },
  { name: "Reddit", value: "reddit", icon: "bi-reddit" },
  { name: "YouTube", value: "youtube", icon: "bi-youtube" },
  { name: "Web", value: "web", icon: "bi-globe-americas" },
  { name: "Other", value: "other", icon: "bi-link-45deg" },
];

const prompt = inquirer.createPromptModule();

prompt([
  { name: "title", message: "Docs title?", default: "Example Title" },
  { name: "author", message: "Author?", default: "John Doe" },
  {
    name: "template",
    message: "Select template?",
    type: "list",
    choices: ["Basic", "Navigation link", "Navigation, Navbar and Footer"],
    default: "Basic",
  },
  {
    name: "theme",
    message: "Select theme?",
    type: "list",
    choices: ["Light", "Dark", "Light and Dark", "Auto Theme"],
    default: "Light",
  },
  {
    name: "multiLang",
    message: "Do you use multiple languages?",
    type: "confirm",
    default: false,
  },
  {
    name: "language",
    message: "Select the languages you want to use:",
    type: "checkbox",
    choices: languageChoices,
    when: (answers) => answers.multiLang,
  },
  {
    name: "links",
    message: "Do you add social media links?",
    type: "confirm",
    default: false,
  },
  {
    name: "sourceLinks",
    message: "Do you add source?",
    type: "confirm",
    default: false,
  },
  {
    name: "socialMedia",
    message: "Select social media platforms",
    type: "checkbox",
    choices: socialMediaPlatforms,
    when: (answers) => answers.links,
  },
]).then(async (answers) => {
  let socialLinks = [];
  let sourceLinks = [];
  let langAnswers = {};

  if (answers.links && answers.socialMedia.length > 0) {
    for (const platformValue of answers.socialMedia) {
      const platform = socialMediaPlatforms.find(p => p.value === platformValue);
      const { url } = await prompt([
        {
          name: "url",
          message: `Enter URL for ${platform.name}:`,
          validate: (input) => input.startsWith("http") ? true : "Enter a valid URL.",
        },
      ]);
      socialLinks.push({
        name: platform.name,
        url,
        value: platform.value,
        icon: platform.icon,
      });
    }
  }

  if (answers.sourceLinks) {
    console.log("\n📜 Kaynakça eklemek için aşağıdaki bilgileri girin.");
    console.log('Çıkmak için "q" tuşuna basın.\n');
    while (true) {
      const { name } = await prompt([
        {
          name: "name",
          message: "Kaynakça ismi:",
        },
      ]);
      if (name.toLowerCase() === "q") break;
      const { url } = await prompt([
        {
          name: "url",
          message: `URL (${name}):`,
          validate: (input) => input.startsWith("http") ? true : "Enter a valid URL.",
        },
      ]);
      sourceLinks.push({ name, url });
    }
  }

  let files = [];
  if (answers.multiLang) {
    for (const langCode of answers.language) {
      const langName = languages.find((lang) => lang.code === langCode)?.name || langCode;
      const langAnswers = await prompt([
        {
          name: "filePath",
          message: `Enter MD file name for ${langName} (without extension):`,
          default: langCode,
        },
      ]);
      files.push({
        langCode,
        docName: answers.title,
        filePath: `${langAnswers.filePath}.md`,
      });
    }
  } else {
    const { filePath } = await prompt([
      {
        name: "filePath",
        message: "Enter MD file name (without extension):",
        default: "documentation",
      },
    ]);
    files.push({
      langCode: "en",
      docName: answers.title,
      filePath: `${filePath}.md`,
    });
  }

  files.forEach(({ langCode, docName, filePath }) => {
    const fullFilePath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullFilePath)) {
      console.error(`❌ File not found: ${fullFilePath}`);
      return;
    }
    const parser = new MDToWeb();
    const outputFile = path.resolve(__dirname, "index.html");
    parser.convertFile(
      fullFilePath,
      outputFile,
      answers.template,
      answers.language,
      files,
      answers.title,
      answers.author,
      answers.theme,
      answers.links,
      sourceLinks,
      socialLinks
    );
  });
});
