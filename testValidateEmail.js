import validateEmail from './src/common/utils/validation/validateEmail.js';

console.log(validateEmail('user@example.com'));     
console.log(validateEmail('invalid-email@'));        
console.log(validateEmail('   test@domain.com  '));  
console.log(validateEmail(''));                      