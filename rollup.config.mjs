import { cleandir } from "rollup-plugin-cleandir";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "refable.ts",
  output: [
    {
      file: "dist/refable.js",
      format: "iife",
      name: "refable",
      sourcemap: true,
    },
    {
      file: "dist/refable.cjs",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/refable.mjs",
      format: "es",
      sourcemap: true,
    },
  ],
  plugins: [cleandir("dist"), typescript(), terser()],
};
