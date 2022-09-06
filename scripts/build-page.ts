import vue from '@vitejs/plugin-vue';
import jsx from "@vitejs/plugin-vue-jsx"
import { build , splitVendorChunkPlugin} from "vite"
import * as FileSystem from "fs-extra"
import * as Path from 'path';

const path = Path.resolve(__dirname, "../src/Pages")
const pagesDir = FileSystem.readdirSync(path)

const input  = {} as Record<string,string>

pagesDir.forEach((pp:string)=>{
  const [ name, type ] = pp.split(".");
  const rawPath = type==="vue"?`${path}/${name}.ts`:`${path}/${pp}`;
  if(type==="vue"){
    FileSystem.ensureFileSync(rawPath)
    FileSystem.writeFileSync(rawPath,`import C from "./${pp}"; export default C`);
  }
  input[name]=rawPath
})



build({
  plugins: [vue(), jsx(),splitVendorChunkPlugin()],
  build:{
    manifest: true,
    outDir:'out',
    rollupOptions:{
      preserveEntrySignatures:"strict",
      input,
      output:{
        entryFileNames:({facadeModuleId})=>{
          console.log(facadeModuleId)
          if(facadeModuleId?.toLowerCase().includes("pages")){
            return "assets/pages/[name].[hash]"
          }
          return "assets/[name].[hash]"
        }
      }
    }
  }
})