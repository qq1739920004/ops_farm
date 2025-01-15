import zh from './language/zh'
import en from './language/en'
import jp from './language/jp'
import i18n from 'sino-i18n-v3';
const messages = {
    zh,
    en,
    jp
};
for(const [key,value] of Object.entries(messages)){
    i18n.global.mergeLocaleMessage(key,value)
}
export default i18n;
