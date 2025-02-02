import { FileConverter } from "./convertFile.js";

const converter = new FileConverter();

class MDToWeb {
  constructor() {}
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
    this.converter = new FileConverter();
    converter.convertFile(
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
  }
}

export default MDToWeb;
