import { FileConverter } from './services/convertFile.js';
import path from 'path';
import fs from 'fs';

const converter = new FileConverter();
const inputFile = path.join(process.cwd(), 'test.md');
const outputFile = path.join(process.cwd(), 'test-result-final.html');

console.log('🔄 MDtoWeb Dönüştürme Başlatıldı...');

converter.convertFile(
  inputFile,
  outputFile,
  'Navigation link',
  false,
  [],
  'MDtoWeb Final Test',
  'Osman Beyhan',
  'Light and Dark',
  false,
  'Only Icon',
  [],
  [],
  '',
  'https://i.hizliresim.com/278ij38.png', 
  'https://i.hizliresim.com/5f8p5h5.png'
);

console.log('✅ İşlem Tamamlandı!');
console.log('📂 Çıktı Dosyası:', outputFile);
