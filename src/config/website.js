/**
 * 全局配置文件
 */
export default {
  title: "saber",
  logo: "X",
  key: 'saber',//配置主键,目前用于存储
  indexTitle: 'BladeX 微服务平台',
  clientId: 'saber', // 客户端id
  clientSecret: 'saber_secret', // 客户端密钥
  tenantMode: true, // 是否开启租户模式
  tenantId: "000000", // 管理组租户编号
  captchaMode: false, // 是否开启验证码模式
  switchMode: false, // 是否开启登录切换角色部门
  lockPage: '/lock',
  tokenTime: 3000,
  tokenHeader: 'Blade-Auth',
  //http的status默认放行列表
  statusWhiteList: [],
  //配置首页不可关闭
  isFirstPage: false,
  fistPage: {
    label: "首页",
    value: "/wel/index",
    params: {},
    query: {},
    meta: {
      i18n: 'dashboard'
    },
    group: [],
    close: false
  },
  //配置菜单的属性
  menu: {
    iconDefault: 'iconfont icon-caidan',
    props: {
      label: 'name',
      path: 'path',
      icon: 'source',
      children: 'children'
    }
  },
  //oauth2配置
  oauth2: {
    // 是否开启注册功能
    registerMode: true,
    // 使用后端工程 @org.springblade.test.Sm2KeyGenerator 获取
    publicKey:
      '04f55f9310939bd76129d70b7376298e7688a920a1c5f6adb3e893c5e0dc4c03be0c3f9a7a426a059202f09f123babe4c226e257acd935efe7f8fc738a515c12c6',
    // 第三方系统授权地址
    authUrl: 'http://localhost/blade-auth/oauth/render',
    // 单点登录系统认证
    ssoMode: false, // 是否开启单点登录功能
    ssoBaseUrl: 'http://localhost:8100', // 单点登录系统地址(cloud端口为8100,boot端口为80)
    ssoAuthUrl: '/oauth/authorize?client_id=saber&response_type=code&redirect_uri=', // 单点登录授权地址
    ssoLogoutUrl: '/oauth/authorize/logout?redirect_uri=', // 单点登录退出地址
    redirectUri: 'http://localhost:1888', // 单点登录回调地址(Saber服务的登录界面地址)
  },
  design: {
    // 报表设计器地址(cloud端口为8108,boot端口为80)
    reportUrl: 'http://localhost:8108/ureport',
  },
}
