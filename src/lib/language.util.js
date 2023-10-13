import { browser } from "$app/environment";
import { get, writable } from "svelte/store";

import {
  register,
  getLocaleFromNavigator,
  init as initI18n,
  locale,
  waitLocale,
} from "svelte-i18n";

export const Languages = Object.freeze({
  EN_US: {
    locale: "en-US",
    file: () => import("$lib/lang/en-US.json"),
    name: "English (US)",
    "date-fns-code": "en-US"
  },
  TR: {
    locale: "tr",
    file: () => import("$lib/lang/tr.json"),
    derivatives: ["tr-tr"],
    name: "Türkçe (TR)",
    "date-fns-code": "tr"
  },
});

export const loadedLanguages = writable([]);
export const languageLoading = writable(false);
export const currentLanguage = writable(null);

export async function init(initialLocale) {
  if (browser && !initialLocale) {
    initialLocale = get(locale);

    if (get(locale) === null) {
      initialLocale = getLocaleFromNavigator();
    }
  }

  const language = getLanguageByLocale(initialLocale);
  const languageToLoad = language || Languages.EN_US;

  await loadLanguage(languageToLoad);
  currentLanguage.set(languageToLoad);

  initI18n({
    fallbackLocale: "en-US",
    initialLocale: languageToLoad.locale,
  });
}

export function getAcceptedLanguage(headers) {
  if (typeof headers.get("accept-language") === "undefined") {
    return "";
  }

  return headers.get("accept-language").split(",")[0];
}

export async function loadLanguage(language) {
  if (get(loadedLanguages).indexOf(language) !== -1) {
    return;
  }

  loadedLanguages.update((list) => {
    list.push(language);

    return list;
  });

  register(language.locale, language.file);
  await waitLocale(language.locale);

  if (language.derivatives) {
    for (const derivative of language.derivatives) {
      register(derivative, language.file);

      await waitLocale(language.locale);
    }
  }
}

export async function changeLanguage(language) {
  if (get(currentLanguage) === language) {
    return;
  }

  languageLoading.set(true);

  if (get(loadedLanguages).indexOf(language) === -1) {
    await loadLanguage(language);
  }

  locale.set(language.locale);
  currentLanguage.set(language);

  languageLoading.set(false);
}

export function getLanguageByLocale(locale) {
  let foundLanguage = null;

  Object.keys(Languages).forEach((key) => {
    const language = Languages[key]

    if (language.locale === locale) {
      foundLanguage = language;
    }
  });

  return foundLanguage;
}
