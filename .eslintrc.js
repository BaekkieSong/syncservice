module.exports = {
  plugins: ["prettier"],
  // extends: ["eslint:recommended", "plugin:prettier/recommended", "prettier"],
  extends: ["eslint : recommended", "google"],
  ignorePatterns: ["**/protocol/*.js"],
  // parserOptions: {
  //   ecmaVersion: 12, // 2021
  //   sourceType: "script",
  //   ecmaFeatures: {
  //     jsx: true, // for XML
  //   },
  // },
  // env: {
  //   browser: true,
  //   node: true,
  //   es6: true,
  // },
  // rules: {
  //   "prettier/prettier": "error",
  //   semi: ["error", "always"],
  //   indent: [
  //     "error",
  //     2,
  //     {
  //       SwitchCase: 1,
  //       MemberExpression: 1,
  //       FunctionDeclaration: { parameters: 1 },
  //       ignoreComments: false,
  //       ImportDeclaration: 1,
  //     },
  //   ],
  //   quotes: ["error", "double"],
  //   "no-empty": "error",
  //   "no-const-assign": "error",
  //   camelcase: "error",
  // },
};
