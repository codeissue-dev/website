import type { I18nConfig } from 'next-i18next/proxy';

const i18nConfig: I18nConfig = {
  supportedLngs: ['en', 'ru'],
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common'],
  localeInPath: false,
  cookieName: 'codeissue-locale',
  resourceLoader: (language, namespace) =>
    import(`./app/i18n/locales/${language}/${namespace}.json`),
};

export default i18nConfig;
