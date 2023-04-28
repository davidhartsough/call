import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
  {
    input: "src/c/app.ts",
    output: {
      file: "public/c/app.js",
      format: "es",
    },
    plugins: [resolve(), typescript(), commonjs()],
  },
  {
    input: "src/s/app.ts",
    output: {
      file: "public/s/app.js",
      format: "es",
    },
    plugins: [resolve(), typescript(), commonjs()],
  },
];
