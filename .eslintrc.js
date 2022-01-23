const baseRules = {
  camelcase: "error",
  curly: ["error", "multi-line"], // leave room for later logic
  "dot-notation": ["error", { allowPattern: "^[a-z]+([-_][a-z]+)+$" }], // `css-case` and `python_case` allowed
  "eol-last": "error", // end files w/ newline - this is git-friendly
  eqeqeq: "error", // please check for type

  "no-await-in-loop": "error", // use Promise.all instead so async calls are fired at once
  "no-console": "error", // we shouldn't be logging from stateless components
  "no-eval": "error", // this is an attack vector
  "no-implicit-coercion": "error", // be kind, use `Boolean()` - not `!!`
  "no-magic-numbers": [
    "error",
    { ignore: [1, 0, -1], ignoreArrayIndexes: true }
  ],
  "no-return-assign": "error",
  "no-shadow": "error", // inner-scope vars should have names separate from outer-scope vars to minimize confusion
  "no-template-curly-in-string": "error", // backticks are required
  "no-trailing-spaces": "error",
  "no-unneeded-ternary": "error", // forbids `thing ? true : false;`

  // you must create a github isssue and comment the number
  "no-warning-comments": [
    "error",
    {
      terms: ["TODO", "FIXME"],
      location: "start"
    }
  ],

  // enforce es6 features
  "no-var": "error", // use `let` or `const`
  "prefer-const": "error", // use `const` when the variable doesn't change
  "prefer-destructuring": "error",
  "prefer-object-spread": "error",
  "prefer-rest-params": "error",
  "prefer-spread": "error",
  "prefer-template": "error",

  // sort identifiers so it's easier to find things
  "sort-imports": [
    "error",
    {
      ignoreCase: true,
      memberSyntaxSortOrder: ["none", "single", "multiple", "all"]
    }
  ],
  "sort-keys": ["error", "asc", { caseSensitive: false, natural: true }],
  "sort-vars": "error",

  yoda: "error", // `"red" === color` => `color === "red"`

  // Require 1 or more newlines after blocks of code for legibility
  "padding-line-between-statements": [
    "error",
    { blankLine: "always", prev: "block-like", next: "*" }
  ]
};

const prettierRules = {
  "prettier/prettier": "error"
};

const jestRules = {
  "jest/prefer-lowercase-title": "warn",
  "jest/no-export": "error"
};

module.exports = {
  extends: [
    "eslint:recommended",
    "prettier",
    "plugin:prettier/recommended",
    "plugin:jest/recommended",
    "plugin:compat/recommended"
  ],
  plugins: ["compat", "prettier", "jest"],
  env: { browser: true, es6: true, jest: true, node: true },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      impliedStrict: true
    }
  },
  settings: {
    polyfills: ["Promise"]
  },
  rules: {
    ...baseRules,
    ...prettierRules,
    ...jestRules
  },
  overrides: [
    {
      files: ["*.test.js"],
      rules: {
        "no-magic-numbers": "off",
        "require-await": "off"
      }
    }
  ]
};
