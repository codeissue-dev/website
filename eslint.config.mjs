import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * Flat ESLint config.
 *
 * Prettier owns formatting; ESLint only owns correctness and code-health rules,
 * so there are no competing style rules here.
 */
export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      "drizzle/meta/**",
      "coverage/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "no-console": "error",
      "no-implicit-coercion": "error",
      "no-param-reassign": "error",
      "object-shorthand": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
      curly: ["error", "multi-line"],
    },
  },
  {
    // The structured logger and the operational entry points are the only
    // places allowed to write to stdout/stderr.
    files: ["src/lib/logger.ts", "scripts/**/*.ts", "server/**/*.ts"],
    rules: { "no-console": "off" },
  },
  {
    files: ["**/*.mjs", "**/*.js"],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: { ...globals.node } },
  },
);
