/** 通知公告分页查询参数 */
/**
 * NoticeQueryParams
 * @extends PageDomain
 * @property {string} noticeTitle
 * @property {string} createBy
 * @property {string} noticeType
 */

/** 通知公告信息 */
/**
 * SysNotice
 * @extends BaseEntity
 * @property {number} noticeId
 * @property {string} noticeTitle
 * @property {'1' | '2'} noticeType
 * @property {string} noticeContent
 * @property {'0' | '1'} status
 * @property {boolean} isRead
 */

/**
 * SysNoticeTopResult
 * @extends AjaxResult
 * @property {number} unreadCount
 */
