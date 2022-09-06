<script setup lang="ts">
import { useDynamicRouter } from "../lib/dynamic-router/client";
import { getPages } from "./api/pages";
type Manifest = Record<
  string,
  {
    file: string;
    isEntry?: boolean;
    imports?: string[];
    src?: string;
    dynamicImports?: string[];
  }
>;
const { mountRoutes, router } = useDynamicRouter();
const init = async () => {
  const {routes, manifest} = await getPages();
  mountRoutes(routes, manifest)
};
init();
const onClick = () => {
  router.push("/bar");
};
</script>

<template>
  <div class="app">
    <router-view></router-view>
    <button @click="onClick">to bar</button>
  </div>
</template>
