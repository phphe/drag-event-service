import { getConfig } from "rogo";

const options = {
  name: "dragEventService",
};

export default [
  getConfig({ ...options, format: "esm" }),
  getConfig({ ...options, format: "cjs" }),
  getConfig({ ...options, format: "iife", minify: true, sourcemap: true }),
];
