#!/usr/bin/env node

import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { existsSync } from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// Paketin global kurulu olduğu yolu al
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paketin kök dizinini bul (global veya local fark etmeksizin)
const packageRoot = resolve(__dirname, "..");

// Template dosyanın tam yolunu oluştur
const templatePath = resolve(packageRoot, "templates");

// Template var mı kontrol et
if (!existsSync(templatePath)) {
  console.error("❌ Template file not found: ", templatePath);
  process.exit(1);
}

// Paketin ana dosyasını çalıştır
import(`${packageRoot}/index.js`).catch((err) => {
  console.error("Modül yüklenirken hata oluştu:", err);
  process.exit(1);
});
