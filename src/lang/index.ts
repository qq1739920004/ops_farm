
import { createI18n } from 'vue-i18n';
// import useAppstore from "@/store/app";
import zh from './language/zh'
import en from './language/en'
const messages = {
    'zh-cn': zh,
    'en': en
};

const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem('language') || 'zh-cn',
    messages: messages,
    globalInjection: true
});

export default i18n;