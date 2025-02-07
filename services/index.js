import { FileConverter } from "./convertFile.js";

const converter = new FileConverter();

class MDToWeb {
  constructor() {}
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
    socialLinks
  ) {
    this.converter = new FileConverter();
    converter.convertFile(
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
      socialLinks
    );
  }
}

export default MDToWeb;
