import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";
import MarkdownParser from "./services/markdownParser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// languages.json dosyasının yolu
const languagesFile = path.join(__dirname, "consts", "languages.json");
const languages = JSON.parse(fs.readFileSync(languagesFile, "utf-8"));

// Dil seçimleri için choices dizisini hazırla
const languageChoices = languages.map((lang) => ({ name: lang.name, value: lang.code }));

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
    name: "language",
    message: "Do you use multiple languages?",
    type: "confirm",
    default: false,
  },
  {
    name: "select_language",
    message: "Select languages",
    type: "checkbox",
    choices: languageChoices,
    when: (answers) => answers.language, // Eğer "yes" seçilirse göster
  },
  {
    name: "filePath",
    message: "Enter MD file name (without extension):",
    default: "documentation",
    when: (answers) => !answers.language, // Eğer "multi-language" seçilmezse tek dosya istenir
  },
]).then(async (answers) => {
  let files = [];

  if (answers.language) {
    // Çoklu dil desteği için
    for (const langCode of answers.select_language) {
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
    // Tek dil desteği için
    files.push({
      langCode: "en",
      docName: answers.title,
      filePath: `${answers.filePath}.md`,
    });
  }

  files.forEach(({ langCode, docName, filePath }) => {
    const fullFilePath = path.join(__dirname, filePath);

    if (!fs.existsSync(fullFilePath)) {
      console.error(`❌ File not found: ${fullFilePath}`);
      return;
    }

    console.log(`✅ File found: ${fullFilePath}`);
    console.log(`⭕ Docs Title: ${docName}`);
    console.log(`👨‍💻 Docs Author: ${answers.author}`);
    console.log(`📦 Template: ${answers.template}`);
    console.log(`🌕 Theme: ${answers.theme}`);
    console.log(`📁 File Path: ${fullFilePath}`);

    const parser = new MarkdownParser();
    const outputFile = path.resolve(__dirname, `index_${langCode}.html`);

    parser.convertFile(fullFilePath, outputFile, answers.template);
  });
});
