import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import ru from './locales/ru.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import nl from './locales/nl.json';
import sv from './locales/sv.json';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  de: { translation: de },
  fr: { translation: fr },
  nl: { translation: nl },
  sv: { translation: sv },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.getLocales()?.[0]?.languageCode ?? 'en', // ← исправлено
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;