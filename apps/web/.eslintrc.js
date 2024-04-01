/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "@repo/eslint-config/next.js",
    "plugin:prettier/recommended",
    "next/core-web-vitals",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["prettier", "unused-imports"],
  parserOptions: {
    project: true,
  },
  rules: {
    "prettier/prettier": "error",
    "react/jsx-sort-props": [
      1,
      {
        callbacksLast: true,
        shorthandFirst: false,
        shorthandLast: true,
        multiline: "first",
        ignoreCase: true,
        noSortAlphabetically: false,
        reservedFirst: ["key", "ref"],
        locale: "auto",
      },
    ],
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "parent", "sibling", "index"],
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
  },
};
