import { Router } from "vue-router"

const seen = {};

const scriptRel = "modulepreload";
  
const base = "/";



export const preload = (baseModule, deps?: string[]) => {
  if (!deps || deps.length === 0) {
    return baseModule();
  }
  return Promise.all(
    deps.map((dep) => {
      dep = `${base}${dep}`;
      if (dep in seen) return;
      seen[dep] = true;
      const isCss = dep.endsWith(".css");
      const cssSelector = isCss ? '[rel="stylesheet"]' : "";
      if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
        return;
      }
      const link = document.createElement("link");
      link.rel = isCss ? "stylesheet" : scriptRel;
      if (!isCss) {
        link.as = "script";
        link.crossOrigin = "";
      }
      link.href = dep;
      document.head.appendChild(link);
      if (isCss) {
        return new Promise((res, rej) => {
          link.addEventListener("load", res);
          link.addEventListener("error", () =>
            rej(new Error(`Unable to preload CSS for ${dep}`))
          );
        });
      }
    })
  ).then(() => baseModule());
};

export const mountRoutes = (routes, manifest, router:Router) => {
  const paths = [];
  for (const { path, file, ...o } of routes) {
    paths.push(path);
    const chunkName = file;
    const chunk = manifest[chunkName];
    router.addRoute({
      path,
      component: () =>
        preload(
          () => import(/* @vite-ignore */ `/${chunk.file}`),
          chunk.imports?chunk.imports.map((item) => manifest[item].file):void 0
        ),
    });
  }
  const cp = router.currentRoute.value.fullPath
  if (paths.includes(cp)) {
    router.replace(cp);
  }
};