/** 模块类型声明 */
declare module '*.vue' {
  const component: DefineComponent
  export default component
}

/** Vite 环境变量类型 */


// element-plus
declare module 'element-plus'

// vue
declare module 'vue' {
  }

// nprogress
declare module 'nprogress' {
  
  
  const nprogress: NProgress
  export default nprogress
}

// js-cookie
declare module 'js-cookie' {
  export default Cookies
}

// file-saver
declare module 'file-saver' {
  export function saveAs(data: Blob | string, filename, options): void
  export function saveAs(data: Blob | string, filename, disableAutoBOM): void
  export default saveAs
}

// jsencrypt
declare module 'jsencrypt/bin/jsencrypt.min' {
  import JSEncrypt from 'jsencrypt'
  export default JSEncrypt
}

// axios
declare module 'axios'

// vue-quill
declare module '@vueup/vue-quill'

// sortablejs
declare module 'sortablejs' {
    
    
  export default class Sortable {
    static create(el: HTMLElement, options: SortableOptions): Sortable;
  }
}

// fuse
declare module 'fuse.js' {
  /**
 * FuseOptions
 */

  
  export default class Fuse {
    constructor(list, options?: FuseOptions)
    search(pattern): T[]
  }
}

// vuedraggable
declare module 'vuedraggable/dist/vuedraggable.common' {
  import { DefineComponent } from 'vue'
  const draggable: DefineComponent
  export default draggable
}

// vue-cropper
declare module 'vue-cropper' {
  import { DefineComponent } from 'vue'
  const VueCropper: DefineComponent
  export { VueCropper }
}

// splitpanes
declare module 'splitpanes' {
  import { DefineComponent } from 'vue'
  
  export const Splitpanes: DefineComponent
  export const Pane: DefineComponent
}
