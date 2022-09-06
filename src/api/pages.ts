import { Api, Post } from "@midwayjs/hooks";
import * as FileSystem from "fs";
import * as Path from "path";
const PAGE_DIR_PATH = "src/Pages";

type Manifest = Record<
  string,
  { file: string; isEntry?: boolean; imports?: string[], src?:string, dynamicImports?:string[] }
>;

interface JSONArray
  extends Array<string | boolean | number | JSONArray | JSONObj> {}
interface JSONObj {
  [key: string]: string | boolean | number | JSONArray | JSONObj;
}
type JSONValue = string | boolean | number | JSONArray | JSONObj;


type RouteRecordOption = {
  path:string,
  name?:string,
  file:string,
  meta?:JSONValue
}

const useDynamicPages = (paths:string[]|string) => {
  /**
   * INPUT
   * 动态页面列表
   * manifest 地址
   * 
   */
  let manifest:Manifest={}
  let includes:string[]=[]

  const getManifest = (routeRaw: RouteRecordOption[])=>{
    const chunkNames = new Set<string>();
    const result:Manifest = {}
    const select = (chunkName:string)=>{
      if(!manifest[chunkName]){
        console.warn(`${chunkName} 没有在文件清单中，请核对`)
        return
      };
      if(chunkNames.has(chunkName))return;
      chunkNames.add(chunkName)
      if(manifest[chunkName].imports&&manifest[chunkName].imports.length>0){
        for(const item of manifest[chunkName].imports){
          select(item)
        }
      }
      if(manifest[chunkName].dynamicImports&&manifest[chunkName].dynamicImports.length>0){
        for(const item of manifest[chunkName].imports){
          select(item)
        }
      }
    }
    for( const route of routeRaw){
      select(route.file)
    }

    
    for(  const chunkName of chunkNames ){
      result[chunkName] = manifest[chunkName];
    }
    return result;
  }
  
  // @todo 切换为 glob 模式
  if(typeof paths==='string'){
    includes=FileSystem.readdirSync(paths).map(path=>Path.posix.join(paths, path))
  }else if(Array.isArray(paths)){
    includes = paths
  }
  if (process.env.MODE === "production") {
    manifest = JSON.parse(
      FileSystem.readFileSync(
        // @todo 动态获取 manifest 文件路径
        Path.resolve(__dirname, "./_client/manifest.json"),
        {
          encoding: "utf-8",
        }
      )
    ) as unknown as Manifest;

  } else {
    for (const path of includes) {
      manifest[path] = {
        file: path,
        src:path,
      };
    }
  }
  return {includes,
    manifest, getManifest}
};

export const getPages = Api(Post(), async () => {
  const routes:RouteRecordOption[] = [
    {
      path:"/bar",
      file:"src/Pages/bar.tsx"
    },
    {
      path:"/foo",
      file:"src/Pages/foo.vue"
    }
  ]
  const { getManifest }= useDynamicPages(PAGE_DIR_PATH)
  return {
    routes,
    manifest:getManifest(routes),
  };
});
