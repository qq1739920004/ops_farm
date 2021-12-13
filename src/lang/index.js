import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from './language/zh'
import en from './language/en'
import locale from 'element-ui/lib/locale'

Vue.use(VueI18n);

const messages = {
    zh,
    en
};
const i18n = new VueI18n({
    locale: 'zh',
    messages
});
locale.i18n((key, value) => i18n.t(key, value));
export default i18n;
