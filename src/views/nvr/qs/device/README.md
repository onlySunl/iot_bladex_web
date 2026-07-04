# 设备管理模块 Device
## 技术栈：Vue2 + ElementUI + Avue
## 组件拆分：业务组件 + 原子细粒度组件
## 公共依赖
1. 全局样式：@/assets/styles/common.scss、@/assets/styles/device.scss
2. 工具方法：@/utils/device.js

## 组件说明
1. DeviceSearch：搜索筛选+新增按钮
2. DeviceTable：设备表格容器，内置4个原子组件
3. DevicePagination：通用分页组件
4. DeviceDialog：新增/编辑弹窗表单
5. 原子组件：状态标签、操作按钮、信息标签、摄像头通道标签

## 事件规范
父组件通过事件监听：search、reset、add、edit、delete、preview、sizeChange、currentChange
## 分页规范
pageNum：当前页码，pageSize：每页条数，total：总条数