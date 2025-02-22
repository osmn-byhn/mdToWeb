import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";
import MDToWeb from "./services/index.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const currentDir = process.cwd();
const languagesFile = path.join(__dirname, "consts", "languages.json");
const languages = JSON.parse(fs.readFileSync(languagesFile, "utf-8"));
import socialMediaPlatforms from "./consts/socialMedia.js";
const languageChoices = languages.map((lang) => ({
  name: lang.name,
  value: lang.code,
}));
const prompt = inquirer.createPromptModule();
prompt([
  { name: "title", message: "Docs title?", default: "Example Title" },
  { name: "author", message: "Author?", default: "John Doe" },
  { name: "icon", message: "Icon for web page", default: "default" },
  {
    name: "useLogo",
    type: "confirm",
    message: "Do you want use logo?",
    default: false,
  },
  {
    name: "logo",
    message: "Logo for web page",
    when: (answers) => answers.useLogo,
  },
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
    name: "useFont",
    type: "confirm",
    message: "Do you want use font?",
    default: false,
  },
  {
    name: "font",
    message: "Font for web page",
    when: (answers) => answers.useFont,
    default: "default"
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
    name: "socialMediaType",
    message: "Select social media type",
    type: "list",
    choices: [
      "Only Icon",
      "Badge",
      "Badge and Username",
      "Vertical Icon",
      "Header Static Icon",
    ],
    when: (answers) => answers.links,
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
  let logoLink = "";
  let iconLink = "";
  let fontLink = "";
  if (answers.useLogo === true && answers.logo?.length > 0) {
    if (answers.logo.startsWith("http://") || answers.logo.startsWith("https://")) {
      logoLink = answers.logo;
    } else {
      if (fs.existsSync(answers.logo)) {
        logoLink = answers.logo;
      } else {
        console.error("The file path is invalid: ", answers.logo);
      }
    }
  }
  if (answers.icon?.length > 0) {
    if (answers.icon === "default") {
      iconLink = "https://i.hizliresim.com/278ij38.png";
    } else if (answers.icon.startsWith("http://") || answers.icon.startsWith("https://")) {
      iconLink = answers.icon;
    } else {
      if (fs.existsSync(answers.icon)) {
        iconLink = answers.icon;
      } else {
        console.error("The file path is invalid: ", answers.icon);
      }
    }
  }
  console.log(iconLink);
  
  if (answers.useFont === true && answers.font?.length > 0) {
    if (answers.font === "default") {
      fontLink = `<link href="https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">`;
    }
    else {
      fontLink = answers.font;
    }
  }
  else {
    fontLink = `<link href="https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">`;
  }
  if (answers.links && answers.socialMedia?.length > 0) {
    for (const platformValue of answers.socialMedia) {
      const platform = socialMediaPlatforms.find(
        (p) => p.value === platformValue
      );
      const { url } = await prompt([
        {
          name: "url",
          message: `Enter URL for ${platform.name}:`,
          validate: (input) =>
            input.startsWith("http") ? true : "Enter a valid URL.",
        },
      ]);
      socialLinks.push({ ...platform, url });
    }
  }
  if (answers.sourceLinks) {
    console.log("\n📜 Enter the following information to add a reference.");
    console.log('Press the "q" key to exit.\n');
    while (true) {
      const { name } = await prompt([
        {
          name: "name",
          message: "Reference name:",
        },
      ]);
      if (name.toLowerCase() === "q") break;
      const { url } = await prompt([
        {
          name: "url",
          message: `URL (${name}):`,
          validate: (input) =>
            input.startsWith("http") ? true : "Enter a valid URL.",
        },
      ]);
      sourceLinks.push({ name, url });
    }
  }
  let files = [];
  if (answers.multiLang) {
    for (const langCode of answers.language) {
      const langName =
        languages.find((lang) => lang.code === langCode)?.name || langCode;
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
    const fullFilePath = path.join(currentDir, filePath);
    if (!fs.existsSync(fullFilePath)) {
      console.error(`❌ File not found: ${fullFilePath}`);
      return;
    }
    const parser = new MDToWeb();
    const outputFile = path.resolve(currentDir, "index.html");
    parser.convertFile(
      fullFilePath,
      outputFile,
      answers.template,
      answers.multiLang,
      files,
      answers.title,
      answers.author,
      answers.theme,
      answers.links,
      answers.socialMediaType,
      sourceLinks,
      socialLinks,
      logoLink,
      iconLink,
      fontLink
    );
  });
});
