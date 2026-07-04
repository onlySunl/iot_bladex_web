import defaultSettings from '@/settings';

const { sideTheme, showSettings, navType, tagsView, tagsViewPersist, tagsIcon, fixedHeader, sidebarLogo, dynamicTitle, footerVisible, footerContent } = defaultSettings;

const storageSetting = (key, def) => {
  const value = localStorage.getItem(key);
  if (value) return JSON.parse(value);
  return def;
};

const state = {
  title: '',
  sideTheme: storageSetting('sideTheme', sideTheme),
  showSettings: storageSetting('showSettings', showSettings),
  navType: storageSetting('navType', navType),
  tagsView: storageSetting('tagsView', tagsView),
  tagsViewPersist: storageSetting('tagsViewPersist', tagsViewPersist),
  tagsIcon: storageSetting('tagsIcon', tagsIcon),
  fixedHeader: storageSetting('fixedHeader', fixedHeader),
  sidebarLogo: storageSetting('sidebarLogo', sidebarLogo),
  dynamicTitle: storageSetting('dynamicTitle', dynamicTitle),
  footerVisible: storageSetting('footerVisible', footerVisible),
  footerContent: storageSetting('footerContent', footerContent),
};

const mutations = {
  CHANGE_TITLE: (state, title) => {
    state.title = title;
  },
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value;
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  CHANGE_SETTINGS: (state, payload) => {
    Object.assign(state, payload);
  },
  RESET_SETTINGS: (state, payload) => {
    Object.keys(payload).forEach(key => {
      localStorage.setItem(key, JSON.stringify(payload[key]));
    });
  },
};

const actions = {

};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
