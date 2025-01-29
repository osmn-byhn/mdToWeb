import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";
import MarkdownParser from "./services/markdownParser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  { name: "file", message: "MD file route?", default: "readme.md" },
]).then((answers) => {
  const filePath = path.join(__dirname, answers.file);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return;
  }

  console.log(`✅ File found: ${filePath}`);
  console.log(`Docs Title: ${answers.title}`);
  console.log(`Docs Author: ${answers.author}`);
  console.log(`Template: ${answers.template}`);
  console.log(`Theme: ${answers.theme}`);
  console.log(`File Path: ${filePath}`);

  const parser = new MarkdownParser();
  const outputFile = path.resolve(__dirname, "index.html");

  parser.convertFile(filePath, outputFile);
});
