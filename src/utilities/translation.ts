/**
 * A dictionary type representing translations,
 * where keys are source tags and values are translated strings.
 */
type TranslationDict = {
  [key: string]: string;
};

/**
 * Options for initializing the Localization system.
 */
export interface TranslationOptions {
  /** The path to the folder where the translations are stored. */
  pathToTranslationsFolder?: string;
  /** The default language to use. */
  defaultLanguage?: string;
  /** If true, the localization will be fixed to the default language, ignoring user language settings. */
  fixedLanguage?: boolean;
}

/**
 * Localization class handles loading and retrieving translation strings
 * from library and mod-specific language files.
 */
export class Localization {
  private static LibTranslation: TranslationDict = {};
  private static ModTranslation: TranslationDict = {};
  private static PathToModTranslation: string | undefined;
  private static PathToLibTranslation: string = `${PUBLIC_URL}/dl_translations/`;
  private static DefaultLanguage: string = 'en';
  /** Flag to prevent re-initialization */
  private static initialized = false;

  /** Initialize the localization system by loading translation files. */
  static async init(initOptions?: TranslationOptions) {
    if (Localization.initialized) return;
    Localization.initialized = true;

    Localization.PathToModTranslation = (() => {
      if (!initOptions?.pathToTranslationsFolder) return undefined;

      return initOptions.pathToTranslationsFolder.endsWith('/') ?
        initOptions.pathToTranslationsFolder :
        `${initOptions.pathToTranslationsFolder}/`;
    })();

    Localization.DefaultLanguage = initOptions?.defaultLanguage || Localization.DefaultLanguage;

    const lang = initOptions?.fixedLanguage ? Localization.DefaultLanguage : TranslationLanguage.toLowerCase();

    const libTranslation = await Localization.fetchLanguageFile(Localization.PathToLibTranslation, lang);
    if (lang === Localization.DefaultLanguage) {
      Localization.LibTranslation = libTranslation;
    } else {
      const fallbackTranslation = await Localization.fetchLanguageFile(Localization.PathToLibTranslation, Localization.DefaultLanguage);
      Localization.LibTranslation = { ...fallbackTranslation, ...libTranslation };
    }

    if (!Localization.PathToModTranslation) return;
    const modTranslation = await Localization.fetchLanguageFile(Localization.PathToModTranslation, lang);
    if (lang === Localization.DefaultLanguage) {
      Localization.ModTranslation = modTranslation;
    } else {
      const fallbackTranslation = await Localization.fetchLanguageFile(Localization.PathToModTranslation, Localization.DefaultLanguage);
      Localization.ModTranslation = { ...fallbackTranslation, ...modTranslation };
    }
  }

  /** Get a translated string from mod translations by source tag. */
  static getTextMod(srcTag: string): string | undefined {
    return Localization.ModTranslation?.[srcTag] || undefined;
  }

  /** Get a translated string from library translations by source tag. */
  static getTextLib(srcTag: string): string | undefined {
    return Localization.LibTranslation?.[srcTag] || undefined;
  }

  /**
   * Fetch and parse a language file from the given base URL and language code.
   * Falls back to default language if the requested language file is unavailable.
   */
  private static async fetchLanguageFile(baseUrl: string, lang: string): Promise<TranslationDict> {
    const response = await fetch(`${baseUrl}${lang}.lang`);

    if (lang !== Localization.DefaultLanguage && !response.ok) {
      return this.fetchLanguageFile(baseUrl, Localization.DefaultLanguage);
    }

    if (!response.ok) {
      return {};
    }

    const langFileContent = await response.text();

    return this.parseLanguageFile(langFileContent);
  }

  /**
   * Parse the raw content of a language file into a TranslationDict.
   * Ignores empty lines and comments starting with '#'.
   */
  private static parseLanguageFile(content: string): TranslationDict {
    const translations: TranslationDict = {};
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const [key, ...rest] = trimmed.split('=');
      translations[key.trim()] = rest.join('=').trim();
    }

    return translations;
  }
}

/**
 * Retrieve a localized string for the given source tag.
 * First attempts to get the mod-specific translation,
 * then falls back to the library translation,
 * and if neither exist, returns the source tag itself.
 */
export const getText = (srcTag: string): string => {
  return Localization.getTextMod(srcTag) || Localization.getTextLib(srcTag) || srcTag;
};
