const tsConfig = require("./tsconfig.json");
const tsConfigExamples = require("./tsconfig.examples.json");

require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  env: {
    es6: true,
  },
  overrides: [
    {
      files: ["*.js"],
      parserOptions: {
        sourceType: "module",
      },
    },
    {
      files: ["*.cjs"],
      env: {
        node: true,
      },
    },
    {
      files: [...tsConfig.include],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        sourceType: "module",
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"],
      },
      extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
    },
    {
      files: [...tsConfigExamples.include],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        sourceType: "module",
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.examples.json"],
      },
      extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
    },
  ],
};
