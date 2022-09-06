import { mountRoutes as _mountRoutes } from "./utils";
import { useRouter } from "vue-router";
export const useDynamicRouter = () => {
  const router = useRouter();
  const mountRoutes = (routes, manifest) => {
    _mountRoutes(routes, manifest, router);
  };

  return { mountRoutes, router };
};
export { mountRoutes } from "./utils"