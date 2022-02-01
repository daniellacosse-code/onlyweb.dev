const rules = {
  "declaration-no-important": true,
  indentation: 2,
  "max-nesting-depth": 2, // excessive nesting makes css selectors difficult to follow
  "property-case": "lower",
  "string-quotes": "double",
  "unit-case": "lower"
};

const plugins = [
  "stylelint-declaration-use-variable",
  "stylelint-high-performance-animation",
  "stylelint-no-indistinguishable-colors",
  "stylelint-no-unsupported-browser-features",
  "stylelint-order",
  "stylelint-prettier",
  "stylelint-z-index-value-constraint"
];

const pluginRules = {
  "order/properties-alphabetical-order": true,
  "plugin/no-low-performance-animation-properties": [
    true,
    {
      // see: https://csstriggers.com/
      ignore: "paint-properties"
    }
  ],
  "plugin/stylelint-no-indistinguishable-colors": true,
  "plugin/no-unsupported-browser-features": [
    true,
    {
      ignore: [
        "css3-cursors" // this is only unsupported on mobile browsers, which don't have cursors anyway
      ]
    }
  ],
  // prefer to establish stacking contexts
  "plugin/z-index-value-constraint": {
    max: 10,
    min: 0
  },
  "prettier/prettier": true,
  // disables raw values for these css properties -  we may come to regret this
  "sh-waqar/declaration-use-variable": [
    [
      "/(background-color|border-radius|color|font-family|margin|max-height|max-width|min-height|min-width|padding|width|z-index)/",
      {
        ignoreValues: [
          "auto",
          "transparent",
          "sans-serif",
          "1",
          "0",
          "-1",
          "none",
          "100%",
          "100vw",
          "100vh"
        ]
      }
    ]
  ]
};

module.exports = {
  extends: "stylelint-config-recommended",
  plugins,
  customSyntax: "postcss-html",
  rules: {
    ...rules,
    ...pluginRules
  }
};
