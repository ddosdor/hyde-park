import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export function createConfig({ ignores = [] } = {}) {
  return [
    {
      ignores: [
        "**/node_modules/**",
        "**/dist/**",
        "**/coverage/**",
        "**/.turbo/**",
        "**/.vitepress/cache/**",
        "**/.vitepress/dist/**",
        ...ignores
      ]
    },
    {
      files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        parser: tsParser,
        globals: {
          clearTimeout: "readonly",
          console: "readonly",
          process: "readonly",
          setTimeout: "readonly"
        },
        parserOptions: {
          ecmaVersion: "latest",
          sourceType: "module"
        }
      },
      plugins: {
        "@typescript-eslint": tsPlugin
      },
      rules: {
        ...js.configs.recommended.rules,
        ...tsPlugin.configs.recommended.rules,
        "no-undef": "off",
        "no-redeclare": "off",
        "@typescript-eslint/consistent-type-imports": [
          "error",
          {
            prefer: "type-imports"
          }
        ],
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            "argsIgnorePattern": "^_",
            "varsIgnorePattern": "^_"
          }
        ]
      }
    }
  ];
}

export default createConfig;
