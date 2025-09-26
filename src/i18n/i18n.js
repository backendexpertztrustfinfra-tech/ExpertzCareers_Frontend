import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import enTranslations from "./locales/en.json"
import hiTranslations from "./locales/hi.json"
import esTranslations from "./locales/es.json"
import frTranslations from "./locales/fr.json"
import deTranslations from "./locales/de.json"
import jaTranslations from "./locales/ja.json"
import koTranslations from "./locales/ko.json"
import zhTranslations from "./locales/zh.json"
import arTranslations from "./locales/ar.json"
import ruTranslations from "./locales/ru.json"

const resources = {
  en: { translation: enTranslations },
  hi: { translation: hiTranslations },
  es: { translation: esTranslations },
  fr: { translation: frTranslations },
  de: { translation: deTranslations },
  ja: { translation: jaTranslations },
  ko: { translation: koTranslations },
  zh: { translation: zhTranslations },
  ar: { translation: arTranslations },
  ru: { translation: ruTranslations },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: false,

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  })

export default i18n
