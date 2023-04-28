module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  files: ["src/**/*.ts"],
  extends: [
    "standard-with-typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["tsconfig.json"],
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
  },
};
