## 项目概述
BladeX Saber Admin - 微服务开发平台前端管理后台（v4.8.0）。基于 Vue 2 + Element UI 的企业级后台管理系统，包含权限管理、路由配置、国际化等模块。

## 技术栈
- **框架**：Vue 2.6 + Vue Router 3 + Vuex 3
- **UI 库**：Element UI 2.15
- **构建工具**：@vue/cli-service 3.x（vue-cli）
- **包管理器**：pnpm（平台要求）
- **样式**：SCSS + PostCSS
- **HTTP**：axios
- **加密**：crypto-js, sm-crypto（国密）
- **国际化**：vue-i18n

## 目录结构
```
src/
├── api/          # API 接口定义
│   ├── qs/       # NVR 设备管理 API（设备、平台、告警、录像等）
│   └── iot/      # IoT 模块 API
├── components/   # 公共组件
│   └── nvr/      # NVR 公共组件（播放器、设备树、通道等）
├── config/       # 全局配置
├── const/        # 常量定义
├── lang/         # 国际化语言包
├── mixins/       # Vue mixins
├── mock/         # Mock 数据
├── option/       # 页面配置项
├── page/         # 页面级组件
├── router/       # 路由配置
├── store/        # Vuex 状态管理
├── styles/       # 全局样式
├── util/         # 工具函数
├── views/        # 页面视图
│   ├── nvr/      # NVR 视频管理模块（从 iot-qs-nvr-ui 迁移）
│   │   ├── device/           # 设备管理
│   │   ├── platform/         # 平台管理
│   │   ├── alarm/            # 告警管理
│   │   ├── live/             # 直播播放
│   │   ├── snapshot/         # 抓图管理
│   │   ├── dashboard/        # 仪表盘
│   │   ├── map/              # 地图
│   │   ├── mediaServer/      # 流媒体服务器
│   │   ├── cloudRecord/      # 云端录像
│   │   ├── recordPlan/       # 录像计划
│   │   ├── recordPlayback/   # 录像回放
│   │   └── deviceRecordPlayback/ # 设备录像回放
│   └── iot/      # IoT 模块
├── main.js       # 入口文件
├── App.vue       # 根组件
├── permission.js # 权限控制
├── cache.js      # 缓存工具
└── error.js      # 错误处理
public/
├── cdn/          # CDN 静态资源（element-ui, avue, xlsx 等）
└── index.html    # HTML 模板
```

## 关键入口 / 核心模块
- **入口**：`src/main.js`
- **路由**：`src/router/`
- **状态管理**：`src/store/`
- **权限控制**：`src/permission.js`
- **API 层**：`src/api/`
- **构建配置**：`vue.config.js`（端口 1888，代理 /api -> localhost:8093）

## 运行与预览
- 开发命令：`pnpm run serve`
- 构建命令：`pnpm run build`
- CDN 外部化：vue、vue-router、vuex、axios、element-ui 通过 externals 配置，由 public/cdn/ 提供
- 后端 API 代理：开发模式 /api -> http://localhost:8093

## 预览链路
- **判定依据**：项目核心实现围绕浏览器可访问的管理后台页面，属于 Web 预览型项目
- **预览入口**：vue-cli-service dev server，通过 `scripts/coze-preview-run.sh` 启动
- **端口**：固定 5000（覆盖原 vue.config.js 中的 1888）
- **根 .coze 映射**：技术项目与工作区根目录重合（path = "."），根 .coze 同时承担子项目 .coze 职责
- **脚本**：
  - `scripts/coze-preview-build.sh` - 安装依赖
  - `scripts/coze-preview-run.sh` - 启动 dev server（0.0.0.0:5000）

## 部署链路
- **部署类型**：service / web（纯前端项目，构建后以静态服务形式部署）
- **构建**：`scripts/coze-deploy-build.sh` - pnpm install + vue-cli-service build，产物在 dist/
- **运行**：`scripts/coze-deploy-run.sh` - 使用 serve 在 5000 端口提供 dist/ 静态服务
- **运行时**：nodejs-24

## 用户偏好与长期约束
- 平台要求使用 pnpm 管理依赖
- Vue 2 项目，不升级到 Vue 3
- 开发端口需要适配平台预览（5000 端口）
- vue-cli 3.x 与 Node.js 24 可能存在兼容性问题，需关注

## 常见问题和预防
- 项目使用 vue-cli 3.x，与较新的 Node.js 版本可能存在兼容性问题
- sass-loader 版本 10.x 需要与 sass 版本匹配
- CDN 资源位于 public/cdn/ 目录，构建时需确保这些资源正确打包
- @element-plus/icons-vue 是 Vue 3 依赖，在 Vue 2 下会有 peer dependency 警告，不影响运行
- pnpm 需要额外安装 cache-loader、babel-loader@8、thread-loader@3 等 loader
- 构建时不支持可选链（?.）语法，需使用传统写法
- NVR 模块从 iot-qs-nvr-ui 迁移，API 路径统一使用 `/api/` 前缀
