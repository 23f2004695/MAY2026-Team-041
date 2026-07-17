import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ar from './locales/ar.json';
import bn from './locales/bn.json';
import en from './locales/en.json';
import es from './locales/es.json';
import gu from './locales/gu.json';
import hi from './locales/hi.json';
import kn from './locales/kn.json';
import ml from './locales/ml.json';
import mr from './locales/mr.json';
import or from './locales/or.json';
import pa from './locales/pa.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import ur from './locales/ur.json';
import zh from './locales/zh.json';

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
    hi: { translation: hi },
    es: { translation: es },
    ar: { translation: ar },
    bn: { translation: bn },
    mr: { translation: mr },
    te: { translation: te },
    ta: { translation: ta },
    gu: { translation: gu },
    ur: { translation: ur },
    kn: { translation: kn },
    or: { translation: or },
    ml: { translation: ml },
    pa: { translation: pa },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
