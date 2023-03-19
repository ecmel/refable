import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";

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
  plugins: [
    typescript(),
    terser(),
    copy({
      targets: [
        {
          src: ["dist/refable.js", "dist/refable.js.map"],
          dest: "docs",
        },
      ],
    }),
  ],
};
