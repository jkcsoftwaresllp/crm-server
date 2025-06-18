import { sanitizeFileName } from './src/common/utils/sanitization/sanitizeFileName.js';

const testCases = [
  { input: '../../etc/passwd', expected: 'etcpasswd' },
  { input: '..\\..\\windows\\system32', expected: 'windowssystem32' },
  { input: 'my*unsafe?file#name.jpg', expected: 'myunsafefilename.jpg' },
  { input: 'valid-file_name.png', expected: 'valid-file_name.png' },
  { input: 'a'.repeat(150) + '.txt', expected: 'a'.repeat(100) },
];

console.log('\n🧪 sanitizeFileName (ESM) Test Results:\n');

testCases.forEach(({ input, expected }, index) => {
  const result = sanitizeFileName(input);
  const status = result === expected ? '✅ PASS' : '❌ FAIL';
  console.log(
    `${status} [Test ${index + 1}]\n  Input:    "${input}"\n  Output:   "${result}"\n  Expected: "${expected}"\n`
  );
});
