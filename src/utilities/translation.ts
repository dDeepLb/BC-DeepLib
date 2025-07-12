type TranslationDict = {
  [key: string]: string;
};

interface InitOptions {
  pathToTranslationsFolder: string;
}

export class Localization {
  private static LibTranslation: TranslationDict = {};
  private static ModTranslation: TranslationDict = {};
  private static PathToModTranslation: string;
  private static PathToLibTranslation: string = `${PUBLIC_URL}/dl_translations/`;
  private static initialized = false;

  static async init(initOptions: InitOptions) {
    if (Localization.initialized) return;
    Localization.initialized = true;

    Localization.PathToModTranslation = initOptions.pathToTranslationsFolder.endsWith('/') ? initOptions.pathToTranslationsFolder : initOptions.pathToTranslationsFolder + '/';

    const lang = TranslationLanguage.toLowerCase();

    const libTranslation = await Localization.fetchLanguageFile(Localization.PathToLibTranslation, lang);
    if (lang === 'en') {
      Localization.LibTranslation = libTranslation;
    } else {
      const fallbackTranslation = await Localization.fetchLanguageFile(Localization.PathToLibTranslation, 'en');
      Localization.LibTranslation = { ...fallbackTranslation, ...libTranslation };
    }

    const modTranslation = await Localization.fetchLanguageFile(Localization.PathToModTranslation, lang);
    if (lang === 'en') {
      Localization.ModTranslation = modTranslation;
    } else {
      const fallbackTranslation = await Localization.fetchLanguageFile(Localization.PathToModTranslation, 'en');
      Localization.ModTranslation = { ...fallbackTranslation, ...modTranslation };
    }
  }

  static getTextMod(srcTag: string): string | undefined {
    return Localization.ModTranslation?.[srcTag] || undefined;
  }

  static getTextLib(srcTag: string): string | undefined {
    return Localization.LibTranslation?.[srcTag] || undefined;
  }

  private static async fetchLanguageFile(baseUrl: string, lang: string): Promise<TranslationDict> {
    const response = await fetch(`${baseUrl}${lang}.lang`);

    if (lang !== 'en' && !response.ok) {
      return this.fetchLanguageFile(baseUrl, 'en');
    }
    const langFileContent = await response.text();

    return this.parseLanguageFile(langFileContent);
  }

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

export const getText = (srcTag: string): string => {
  return Localization.getTextMod(srcTag) || Localization.getTextLib(srcTag) || srcTag;
};
