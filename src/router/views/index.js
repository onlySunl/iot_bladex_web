import Layout from '@/page/index/'

// ZLM 流媒体服务相关路由
const zlmRoutes = [{
  path: '/easyPlayer',
  component: () => import('@/views/nvr/components/easyPlayer.vue'),
  name: 'EasyPlayer',
  meta: { menu: false }
}, {
  path: '/mediaServer/addMediaServer',
  component: Layout,
  hidden: true,
  children: [{
    noCache: true,
    path: 'index',
    component: () => import('@/views/nvr/mediaServer/addMediaServer.vue'),
    name: 'AddMediaServer',
    meta: { title: '添加媒体服务器', activeMenu: '/mediaServer' }
  }]
}, {
  path: '/mediaServer/updateMediaServer',
  component: Layout,
  hidden: true,
  children: [{
    noCache: true,
    path: 'index',
    component: () => import('@/views/nvr/mediaServer/updateMediaServer.vue'),
    name: 'UpdateMediaServer',
    meta: { title: '修改媒体服务器', activeMenu: '/mediaServer' }
  }]
}, {
  path: '/nvr/deviceRecordPlayback',
  component: Layout,
  hidden: true,
  children: [{
    noCache: false,
    path: 'index',
    component: () => import('@/views/nvr/deviceRecordPlayback/index.vue'),
    name: 'DeviceRecordPlayback',
    meta: { title: '设备录像回放', activeMenu: '/nvr/deviceRecordPlayback' }
  }]
}, {
  path: '/nvr/recordPlayback',
  component: Layout,
  hidden: true,
  children: [{
    noCache: false,
    path: 'index',
    component: () => import('@/views/nvr/recordPlayback/index.vue'),
    name: 'RecordPlayback',
    meta: { title: '录像回放', activeMenu: '/nvr/recordPlayback' }
  }]
}, {
  path: '/nvr/cloudRecord',
  component: Layout,
  hidden: true,
  children: [{
    noCache: false,
    path: 'index',
    component: () => import('@/views/nvr/cloudRecord/index.vue'),
    name: 'CloudRecord',
    meta: { title: '云端录像', activeMenu: '/nvr/cloudRecord' }
  }]
}]

export default [...zlmRoutes, {
  path: '/wel',
  component: Layout,
  redirect: '/wel/index',
  children: [{
    path: 'index',
    name: '首页',
    meta: {
      i18n: 'dashboard'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/wel/index')
  }, {
    path: 'dashboard',
    name: '控制台',
    meta: {
      i18n: 'dashboard',
      menu: false,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/wel/dashboard')
  }]
}, {
  path: '/test',
  component: Layout,
  redirect: '/test/index',
  children: [{
    path: 'index',
    name: '测试页',
    meta: {
      i18n: 'test'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/util/test')
  }]
}, {
  path: '/dict-horizontal',
  component: Layout,
  redirect: '/dict-horizontal/index',
  children: [{
    path: 'index',
    name: '字典管理',
    meta: {
      i18n: 'dict'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/util/demo/dict-horizontal')
  }]
}, {
  path: '/dict-vertical',
  component: Layout,
  redirect: '/dict-vertical/index',
  children: [{
    path: 'index',
    name: '字典管理',
    meta: {
      i18n: 'dict'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/util/demo/dict-vertical')
  }]
}, {
  path: '/info',
  component: Layout,
  redirect: '/info/index',
  children: [{
    path: 'index',
    name: '个人信息',
    meta: {
      i18n: 'info'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/system/userinfo')
  }]
}, {
  path: '/work/process/leave',
  component: Layout,
  redirect: '/work/process/leave/form',
  children: [{
    path: 'form/:processDefinitionId',
    name: '请假流程',
    meta: {
      i18n: 'work'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/work/process/leave/form')
  }, {
    path: 'handle/:taskId/:processInstanceId/:businessId',
    name: '处理请假流程',
    meta: {
      i18n: 'work'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/work/process/leave/handle')
  }, {
    path: 'detail/:processInstanceId/:businessId',
    name: '请假流程详情',
    meta: {
      i18n: 'work'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/work/process/leave/detail')
  }]
}]
