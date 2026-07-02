/** 模块类型声明 */
declare module '*.vue' {
  const component
  export default component

/** Vite 环境变量类型 */
/**
 * ImportMetaEnv
 */

/**
 * ImportMeta
 */

// element-plus
declare module 'element-plus'
// vue
declare module 'vue' {
  interface ComponentInternalInstance { proxy }

// nprogress
declare module 'nprogress' {
    minimum?
    template?
    easing?
    speed?
    trickle?
    trickleSpeed?
    showSpinner?
    parent?
    barSelector?
  }
    start()
    set(n)
    inc(amount?)
    done(force?)
    remove()
    configure(options)
    status | null
  }
  const nprogress
  export default nprogress

// js-cookie
declare module 'js-cookie' {
  export default Cookies

// file-saver
declare module 'file-saver' {
  export function saveAs(data | string, filename?, options?)
  export function saveAs(data | string, filename?, disableAutoBOM?)
  export default saveAs

// jsencrypt
declare module 'jsencrypt/bin/jsencrypt.min' {
  import JSEncrypt from 'jsencrypt'
  export default JSEncrypt

// axios
declare module 'axios'
// vue-quill
declare module '@vueup/vue-quill'
// sortablejs
declare module 'sortablejs' {
    oldIndex;
    newIndex;
  }
    ghostClass?;
    onEnd?: (evt) => void;
  }
  export default class Sortable {
    static create(el, options);
  }

// fuse
declare module 'fuse.js' {
    keys;
    threshold?;
    includeScore?;
    includeMatches?;
    minMatchCharLength?;
    shouldSort?;
    // 添加其他你需要的选项
  }
  export default class Fuse<T> {
    constructor(list, options?)
    search(pattern)
  }

// vuedraggable
declare module 'vuedraggable/dist/vuedraggable.common' {
  import { DefineComponent } from 'vue'
  const draggable
  export default draggable

// vue-cropper
declare module 'vue-cropper' {
  import { DefineComponent } from 'vue'
  const VueCropper
  export { VueCropper }

// splitpanes
declare module 'splitpanes' {
  import { DefineComponent } from 'vue'
  export const Splitpanes
  export const Pane
