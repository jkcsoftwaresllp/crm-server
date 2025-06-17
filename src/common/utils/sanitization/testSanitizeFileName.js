import sanitizeFileName from './sanitizeFileName.js';

const testCases = [
  '../evil.jpg',
  'normal_file.png',
  'weird!@#name$$$.pdf',
  '.../../path\\to\\hack.exe',
  'a'.repeat(150) + '.txt',
];

testCases.forEach(original => {
  const sanitized = sanitizeFileName(original);
  console.log(`Original: ${original}\nSanitized: ${sanitized}\n`);
});
