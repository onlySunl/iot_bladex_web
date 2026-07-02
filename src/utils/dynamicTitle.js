import defaultSettings from '@/settings';
import store from '@/store';

/**
 * 动态修改页面标题
 * @param {string} pageTitle - 页面标题
 */
export function dynamicTitle(pageTitle) {
  const title = store.getters.title || defaultSettings.title || 'BladeX';
  if (pageTitle) {
    document.title = `${pageTitle} - ${title}`;
  } else {
    document.title = title;
  }
}

export default dynamicTitle;
