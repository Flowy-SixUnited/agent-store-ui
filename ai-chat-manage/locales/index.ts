import { createI18n } from "vue-i18n";
import zh from "./zh";
import en from "./en";
import ft from "./ft";
// 语言包
const messages = {
  zh,
  en,
  ft
};
const i18n = createI18n({
  legacy: false, //处理报错信息，默认为真
  locale: "zh", //默认语言
  messages
});
export default i18n;
