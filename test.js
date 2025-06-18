import { validatePassword } from "./src/common/utils/validation/validatePassword.js";

const testCases = [
  {
    input: "Password123!",
    expected: true,
    description: "Valid password with uppercase, lowercase, number, and special character"
  },
  {
    input: "password123!",
    expected: false,
    description: "Missing uppercase letter"
  },
  {
    input: "PASSWORD123!",
    expected: false,
    description: "Missing lowercase letter"
  },
  {
    input: "Password!!!",
    expected: false,
    description: "Missing number"
  },
  {
    input: "Password123",
    expected: false,
    description: "Missing special character"
  },
  {
    input: "Pass1!",
    expected: false,
    description: "Too short"
  },
  {
    input: "",
    expected: false,
    description: "Empty string"
  },
  {
    input: 12345678,
    expected: false,
    description: "Not a string input"
  }
];

console.log("Running validatePassword tests...\n");

testCases.forEach((test, index) => {
  const result = validatePassword(test.input);
  const pass = result.valid === test.expected;

  console.log(
    `Test ${index + 1}: ${test.description}\n` +
    `  Input: ${test.input}\n` +
    `  Expected: ${test.expected}, Got: ${result.valid}\n` +
    `  Result: ${pass ? '✅ Passed' : '❌ Failed'}\n`
  );

  if (!pass && result.errors.length) {
    console.log("  Errors:", result.errors.join("; "));
  }

  console.log('--------------------------------------');
});
