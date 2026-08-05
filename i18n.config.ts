import type { I18nConfig } from 'next-i18next/proxy';

import { brandConfig } from './lib/brand/config';

const i18nConfig: I18nConfig = {
  supportedLngs: ['en', 'ru'],
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common'],
  localeInPath: false,
  cookieName: brandConfig.localeCookie,
  resourceLoader: (language, namespace) =>
    import(`./locales/${language}/${namespace}.json`),
};

export default i18nConfig;
