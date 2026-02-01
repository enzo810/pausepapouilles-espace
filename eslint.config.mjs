// eslint.config.js
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const config = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "generated/**",
      "__test__/**",
      "*.test.ts",
      "*.test.tsx",
    ],
  },
  ...compat.config({
    extends: ["next", "next/core-web-vitals"],
  }),
];

export default config;
