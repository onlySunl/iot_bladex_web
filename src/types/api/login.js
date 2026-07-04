// 登录响应
/**
 * LoginInfoResult
 * @extends AjaxResult
 * @property {string} access_token
 * @property {number} expires_in
 */

/** 用户信息响应 */
/**
 * UserInfoResult
 * @extends AjaxResult
 * @property {SysUser} user
 * @property {string[]} roles
 * @property {string[]} permissions
 * @property {boolean} isDefaultModifyPwd
 * @property {boolean} isPasswordExpired
 */

/** 验证码响应 */
/**
 * CaptchaInfoResult
 * @extends AjaxResult
 * @property {string} uuid
 * @property {string} img
 * @property {boolean} captchaEnabled
 */

/** 注册提交信息 */
/**
 * RegisterForm
 * @property {string} username
 * @property {string} password
 * @property {string} confirmPassword
 * @property {string} code
 * @property {string} uuid
 */

/** 登录提交信息 */
/**
 * LoginForm
 * @property {string} username
 * @property {string} password
 * @property {boolean | string} rememberMe
 * @property {string} code
 * @property {string} uuid
 */
