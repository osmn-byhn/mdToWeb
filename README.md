# MDtoWeb

[![NPM Version](https://img.shields.io/npm/v/mdtoweb-cli.svg)](https://www.npmjs.com/package/mdtoweb-cli)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A powerful command-line tool to convert Markdown files into beautiful, customizable HTML web pages with multiple themes, templates, and features.

## 📚 Overview

MDtoWeb is a versatile markdown-to-HTML converter that transforms your documentation, notes, or any markdown content into professional web pages with minimal effort. Choose from different templates, customize themes, add social media links, and create multi-language documentation with a simple CLI interface.

## ✨ Features

- 🎨 Multiple templates (Basic, Navigation link)
- 🌓 Theme options (Light, Dark, Light and Dark toggle, Auto Theme)
- 🌐 Multi-language support
- 🔗 Social media integration with various display styles
- 📝 Source reference links
- 🖼️ Custom logo and favicon support
- 🔤 Custom font selection
- 📱 Responsive design
- 🎯 Auto-generated table of contents with anchor links
- 💅 Syntax highlighting for code blocks
- 📋 Code block copy button

## 🚀 Installation

```bash
npm install -g mdtoweb-cli
```

## 🔧 Usage

Simply run the CLI command in your terminal:

```bash
mdtoweb
```

Follow the interactive prompts to configure your web page:

1. Enter document title
2. Specify author name
3. Choose an icon/favicon
4. Add a logo (optional)
5. Select a template (Basic or Navigation link)
6. Choose a theme (Light, Dark, Light and Dark, Auto Theme)
7. Select a custom font (optional)
8. Enable multi-language support (optional)
9. Add social media links (optional)
10. Add reference sources (optional)

## 🖼️ Templates

### Basic Template
A clean, simple layout that focuses on content. Perfect for documentation, articles, or simple pages.

### Navigation Link Template
Includes a sidebar navigation that automatically generates links from your markdown headings. Ideal for documentation with multiple sections.

## 🎨 Themes

- **Light**: Clean white background with dark text
- **Dark**: Dark background with light text
- **Light and Dark**: Includes a theme toggle button for user preference
- **Auto Theme**: Adapts to user's system preferences

## 🌐 Multi-Language Support

Create documentation in multiple languages and allow users to switch between them with a simple dropdown selector. The tool will guide you through setting up different markdown files for each language.

## 🔗 Social Media Integration

Add links to your social media profiles with several display options:
- Only Icon
- Badge
- Badge and Username
- Vertical Icon
- Header Static Icon

## 📝 Markdown Features Support

MDtoWeb supports most common markdown features:

- Headings (H1-H6)
- **Bold** and *Italic* text
- ~~Strikethrough~~
- `Code` and ```Code blocks``` with syntax highlighting
- > Blockquotes
- Ordered and unordered lists
- Nested lists
- Task lists
- Tables
- Images with optional sizing
- Horizontal rules
- Links

## 📋 Example

Here's an example of how to use MDtoWeb:

1. Create your markdown file (e.g., `documentation.md`)
2. Run `mdtoweb` in your terminal
3. Follow the prompts to configure your web page
4. The tool will generate an `index.html` file in your current directory

## 📦 Project Structure

```
mdtoweb-cli/
├── bin/
│   └── cli.js           # CLI entry point
├── consts/
│   ├── components/      # UI components
│   ├── templates/       # HTML templates
│   ├── languages.json   # Supported languages
│   └── socialMedia.js   # Social media platforms
├── services/
│   ├── convertFile.js   # File conversion logic
│   ├── MarkdownParser.js # Markdown parsing
│   └── index.js         # Service exports
├── index.js             # Main application logic
└── package.json         # Project configuration
```

## 📋 Requirements

- Node.js 14.x or higher
- npm 6.x or higher

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/osmn-byhn/mdToWeb/issues).

## 📄 License

This project is [ISC](https://opensource.org/licenses/ISC) licensed.

## 👨‍💻 Author

- **Osman Beyhan** - [GitHub](https://github.com/osmn-byhn)
- Website: [mdtoweb.osmanbeyhan.com](https://www.mdtoweb.osmanbeyhan.com/)

## 🙏 Acknowledgements

- Markdown parsing and HTML generation
- Interactive CLI with Inquirer.js
- HTML beautification with js-beautify
- DOM manipulation with jsdom 