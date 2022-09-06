import * as Path from "path";
import { Plugin } from "vite";
import fg from "fast-glob";
import normalize from "normalize-path";
export const dynamicRouterPlugin: (option: {
  includes: string[];
}) => Plugin = ({ includes }) => ({
  name: "DynamicRouter",
  config: (config, env) => {
    if (!config.build) {
      config.build = {
        manifest: true,
      };
    } else {
      config.build.manifest = true;
    }
    return config;
  },
  options: (option) => {
    let input;

    const match = fg.sync(
      includes.map((p) => normalize(p)),
      { onlyFiles: true }
    );
    if (typeof option.input === "string") {
      input = [option.input, ...match];
    } else if (Array.isArray(option.input)) {
      input = [...option.input, ...match];
    } else {
      input = option.input;
      match.forEach((p: string) => {
        input[Path.parse(p).name] = p;
      });
    }
    option.preserveEntrySignatures = "strict";
    option.input = input;
    return option;
  },
});
