import { get, writable } from "svelte/store";

import {
  register,
  init as initI18n,
  locale,
  waitLocale,
} from "svelte-i18n";

export const Languages = Object.freeze({
  EN_US: {
    locale: "en-US",
    file: () => import("$lib/lang/en-US.json"),
    name: "English (US)",
  },
  TR: {
    locale: "tr",
    file: () => import("$lib/lang/tr.json"),
    derivatives: ["tr-tr"],
    name: "Türkçe (TR)",
  },
});

export const loadedLanguages = writable([]);
export const languageLoading = writable(false);
export const currentLanguage = writable({});
export const defaultLanguage = Languages.EN_US

export async function init(locale) {
  const initialLocale = getLanguageByLocale(locale)
  const languageToLoad = getLocaleOrDefaultByLocale(initialLocale)

  await loadLanguage(languageToLoad);
  currentLanguage.set(languageToLoad);

  initI18n({
    fallbackLocale: defaultLanguage.locale,
    initialLocale,
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

  Object.keys(Languages).forEach((language) => {
    if (Languages[language].locale === locale) {
      foundLanguage = language;
    }
  });

  return foundLanguage;
}

export function getLocaleOrDefaultByLocale(locale) {
  if (!locale) {
    return defaultLanguage.locale;
  }

  const language = getLanguageByLocale(locale)

  if (!language) {
    return defaultLanguage.locale;
  }

  return language.locale
}