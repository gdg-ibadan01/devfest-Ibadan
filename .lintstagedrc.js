const path = require('path');

const buildBackendEslintCommand = (filenames) =>
  `eslint --fix ${filenames
    .map((f) => `"${path.relative(process.cwd(), f)}"`)
    .join(' ')}`;

const buildPrettierCommand = (filenames) =>
  `prettier --write ${filenames
    .map((f) => `"${path.relative(process.cwd(), f)}"`)
    .join(' ')}`;

module.exports = {
  // Backend uses plain ESLint
  'backend/**/*.{js,jsx,ts,tsx}': [
    buildBackendEslintCommand,
    buildPrettierCommand,
  ],
  'backend/**/*.{json,scss}': [buildPrettierCommand],

  // If you also want to lint frontend with Next.js
  'frontend/**/*.{js,jsx,ts,tsx}': (filenames) =>
    `next lint --fix --file ${filenames
      .map((f) => path.relative(process.cwd(), f))
      .join(' --file ')}`,
  'frontend/**/*.{json,scss}': [buildPrettierCommand],
};
