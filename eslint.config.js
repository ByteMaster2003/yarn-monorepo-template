import airbnbBase from "eslint-config-airbnb-base";
import configPrettier from "eslint-config-prettier";
import pluginImport from "eslint-plugin-import";
import pluginPrettier from "eslint-plugin-prettier";
import pluginReact from "eslint-plugin-react";
import pluginSecurity from "eslint-plugin-security";
import globals from "globals";

const baseRules = {
  // Base rules
  ...airbnbBase.rules,
  ...configPrettier.rules,

  // General rules
  "prefer-const": ["error"],
  "no-console": ["warn"],
  "no-unused-vars": ["error"],
  "no-unused-expressions": ["error"],
  quotes: ["error", "double"],
  camelcase: ["error", { properties: "always", allow: ["required_error", "invalid_type_error"] }],

  // Prettier Rules
  "prettier/prettier": ["error"]
};

const importRules = {
  // Critical: Prevent incorrect imports
  "import/no-unresolved": "error",
  "import/no-commonjs": "error",
  "import/no-duplicates": "error",
  "import/named": "error",
  "import/default": "error",
  "import/namespace": "error",
  "import/no-absolute-path": "error",
  "import/no-self-import": "error",
  "import/no-cycle": ["error", { maxDepth: 1 }],
  "import/no-useless-path-segments": ["error", { noUselessIndex: true }],

  // Helpful warnings
  "import/no-deprecated": "warn",
  "import/no-mutable-exports": "warn",

  // Import rules
  "import/order": [
    "error",
    {
      groups: [
        "builtin", // Node.js built-in modules
        "external", // Packages
        "internal", // Aliased modules
        ["parent", "sibling"], // Relative imports
        "index", // Index imports
        "object", // Object imports
        "type" // Type imports
      ],
      "newlines-between": "always",
      alphabetize: {
        order: "asc",
        caseInsensitive: true
      },
      pathGroups: [
        // Force node: protocol for built-in modules
        {
          pattern: "node:*",
          group: "builtin",
          position: "before"
        },
        // Example: Group React imports first
        {
          pattern: "react",
          group: "external",
          position: "before"
        },
        // Group your internal packages
        {
          pattern: "@monorepo/**",
          group: "internal",
          position: "before"
        }
      ],
      distinctGroup: false
    }
  ],

  // Extension rules
  "import/extensions": [
    "error",
    "ignorePackages",
    {
      js: "never",
      mjs: "never",
      jsx: "never"
    }
  ]
};

const settings = {
  "import/resolver": {
    node: {
      extensions: [".js", ".jsx", ".mjs"],
      moduleDirectory: ["node_modules", "src"]
    }
  },
  "import/internal-regex": "^@monorepo/"
};

export default [
  // Base configuration for all JavaScript files
  {
    files: ["**/*.{js,mjs,cjs}"],
    ignores: ["node_modules/**", "dist/**"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      },
      ecmaVersion: 2022,
      sourceType: "module"
    },
    plugins: {
      security: pluginSecurity,
      prettier: pluginPrettier,
      import: pluginImport
    },
    settings,
    rules: {
      // Base Rules
      ...baseRules,

      // Import Rules
      ...importRules,

      // Security Plugins
      "security/detect-object-injection": "off"
    }
  },

  // Specific configuration for JSX files
  {
    files: ["**/*.{jsx,tsx}"],
    ignores: ["node_modules/**", "dist/**"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest
      },
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react: pluginReact,
      prettier: pluginPrettier,
      import: pluginImport
    },
    rules: {
      // Base Rules
      ...baseRules,

      // Import Rules
      ...importRules,

      // React/JSX specific rules
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "react/react-in-jsx-scope": "error",
      "react/jsx-filename-extension": ["error", { extensions: [".jsx", ".tsx"] }],
      "react/prop-types": "error"
    }
  }
];
