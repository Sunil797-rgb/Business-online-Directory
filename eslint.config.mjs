import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // .preview-build and preview-out hold generated output from
    // `node preview/build.mjs`; they are build artifacts, not source.
    ignores: [
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      ".preview-build/**",
      "preview-out/**",
    ],
  },
];

export default eslintConfig;
