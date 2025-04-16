import { I18n } from "i18n";
import en from "../locales/en.json" with { type: "json" };
import ja from "../locales/ja.json" with { type: "json" };
import { kibela } from "./kibela.ts";

declare global {
  var intl: typeof i18n;
}

const i18n = new I18n({
  locales: ["en", "ja"],
  staticCatalog: { en, ja },
});

global.intl = i18n

const data = await kibela.GetCurrentUser()

global.intl.setLocale(data.currentUser.locale);
