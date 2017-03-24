import { OpaqueToken } from '@angular/core';

// import translations
import { LANG_AR_NAME, LANG_AR_TRANS } from './lang-ar';
import { LANG_EN_NAME, LANG_EN_TRANS } from './lang-en';

// translation token
export const TRANSLATIONS = new OpaqueToken('translations');


// providers
export const TRANSLATION_PROVIDERS = [
    { provide: TRANSLATIONS, useValue: {
        'ar': LANG_AR_TRANS,
        'en': LANG_EN_TRANS
    }},
];
