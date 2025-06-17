import validateEmail from './validateEmail.js';

const testCases = [
  '',
  'plainaddress',
  'missing@domain',
  'missing@dot.',
  'valid@example.com',
  ' VALID@EXAMPLE.COM ',
  'user@sub.domain.com',
  'user+test@example.co.in'
];

testCases.forEach((email, index) => {
  const result = validateEmail(email);
  console.log(`${index + 1}. "${email}" ->`, result);
});


