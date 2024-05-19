type TranslationDict = {
  [key: string]: string;
};

export class Localization {
  private Translation: TranslationDict = {};
  private static PathToTranslation: string;

  constructor(options: {
    pathToTranslationsFolder: string;
  }) {
    Localization.PathToTranslation = options.pathToTranslationsFolder.endsWith('/') ? options.pathToTranslationsFolder : options.pathToTranslationsFolder + '/';

    Localization.init();
  }

  static async init() {
    const lang = TranslationLanguage.toLowerCase();
    const translation = await Localization.fetchLanguageFile(lang);

    if (lang === 'en') {
      Localization.prototype.Translation = translation;
    } else {
      const fallbackTranslation = await Localization.fetchLanguageFile('en');
      Localization.prototype.Translation = { ...fallbackTranslation, ...translation };
    }
  }

  static getText(srcTag: string) {
    return Localization.prototype.Translation[srcTag] || srcTag || '';
  }

  private static async fetchLanguageFile(lang: string): Promise<TranslationDict> {
    const response = await fetch(`${Localization.PathToTranslation}${lang}.lang`);

    if (lang !== 'en' && !response.ok) {
      return this.fetchLanguageFile('en');
    }
    const langFileContent = await response.text();

    return this.parseLanguageFile(langFileContent);
  }

  private static parseLanguageFile(content: string): TranslationDict {
    const translations: TranslationDict = {};
    const lines = content.split('\n');

    for (const line of lines) {
      if (line.trim() === '' || line.trim().startsWith('#')) {
        continue;
      }

      const [key, value] = line.split('=');
      translations[key.trim()] = value.trim();
    }

    return translations;
  }
}

export const getText = (string: string): string => Localization.getText(string);
