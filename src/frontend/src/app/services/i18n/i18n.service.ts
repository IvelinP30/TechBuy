import { Injectable } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { includes } from 'lodash';
import { environment } from '../../../environments/environment';
import enUS  from '../../../assets/i18n/en.json';
import bgBG  from '../../../assets/i18n/bg.json';

const languageKey = 'language';

@Injectable({ providedIn: 'root' })
export class I18nService {
  defaultLanguage: string = environment.defaultLanguage;
  supportedLanguages: Language[] = environment.supportedLanguages;

  constructor(public translateService: TranslateService) {
    translateService.setTranslation('en-US', enUS)
    translateService.setTranslation('bg-BG', bgBG)
  }

  initializeLanguage(defaultLanguage: string, supportedLanguages: Language[]) {
    this.defaultLanguage = defaultLanguage;
    this.supportedLanguages = supportedLanguages;
    this.language = ''

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      localStorage.setItem(languageKey, event.lang);
    });
  }

set language(language: string) {
  language = language || localStorage.getItem(languageKey) || this.translateService.getBrowserCultureLang() || '';
  
  let isSupportedLanguage = includes(this.supportedLanguages.map(current => current.id), language);

  if (language && !isSupportedLanguage) {
    language = language.split('-')[0];
    const foundLanguage = this.supportedLanguages.find(supportedLanguage => 
      supportedLanguage.id.startsWith(language)
    );

    language = foundLanguage ? foundLanguage.id : this.defaultLanguage;
  }

  if (!isSupportedLanguage) {
    language = this.defaultLanguage;
  }

  this.translateService.use(language);
}


  get language(): string {
    return this.translateService.currentLang;
  }

  get currentLanguage(): Language {
    return this.supportedLanguages.find(current => current.id === this.translateService.currentLang) || this.supportedLanguages[0];
  }
}

export interface Language {
  id: string;
  name: string;
}
