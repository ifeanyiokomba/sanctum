export default [
  {
    ignores: ["node_modules", "dist", "build", ".turbo", "*.config.*", "coverage"]
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: ["./tsconfig.json", "./packages/*/tsconfig.json", "./apps/*/tsconfig.json"]
      }
    },
    settings: {
      react: { version: "18.3" }
    },
    plugins: {
      react: await import("eslint-plugin-react"),
      "react-hooks": await import("eslint-plugin-react-hooks"),
      "@typescript-eslint": await import("@typescript-eslint/eslint-plugin")
    },
    rules: {
      ...(await import("eslint-plugin-react")).configs.recommended.rules,
      ...(await import("eslint-plugin-react-hooks")).configs.recommended.rules,
      ...(await import("@typescript-eslint/eslint-plugin")).configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn"
    }
  }
]