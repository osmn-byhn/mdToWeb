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
    socialLinks,
    logoLink,
    iconLink,
    fontLink
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
      socialLinks,
      logoLink,
      iconLink,
      fontLink
    );
  }
}

export default MDToWeb;
