#!/usr/bin/env node

import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import(`${__dirname}/../index.js`).catch((err) => {
  console.error("Modül yüklenirken hata oluştu:", err);
  process.exit(1);
});
