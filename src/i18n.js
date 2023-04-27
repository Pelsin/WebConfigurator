import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import english from './translations/english.json';
import swedish from './translations/swedish.json';

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false,
		},
		resources: {
			en: {
				translation: english,
			},
			sv: {
				translation: swedish,
			},
		},
	});

export default i18n;
