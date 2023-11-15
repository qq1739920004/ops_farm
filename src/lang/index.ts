import { createI18n } from 'vue-i18n';
import zh from './language/zh'
import en from './language/en'

import useAppStore from '@/store/app'
const appStore = useAppStore()

const messages = {
    'zh': zh,
    'en': en
};

const i18n = createI18n({
    legacy: false,
    locale: appStore.language,
    messages: messages,
    globalInjection: true
});

export default i18n;