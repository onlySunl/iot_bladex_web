export function importAllComponents(modules) {
    const compObj = {}
    for (const path in modules) {
        // modules[path] 是 { default: 组件 }
        const mod = modules[path]
        // 提取文件名 DeviceXxx.vue
        const match = path.match(/\/([^/]+)\.vue$/)
        if (!match) continue
        const compName = match[1]
        // 取出真正组件实例 mod.default
        compObj[compName] = mod.default
    }
    return compObj
}