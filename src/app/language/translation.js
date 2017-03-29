"use strict";
var core_1 = require('@angular/core');
// import translations
var lang_ar_1 = require('./lang-ar');
var lang_en_1 = require('./lang-en');
// translation token
exports.TRANSLATIONS = new core_1.OpaqueToken('translations');
// providers
exports.TRANSLATION_PROVIDERS = [
    { provide: exports.TRANSLATIONS, useValue: {
            'ar': lang_ar_1.LANG_AR_TRANS,
            'en': lang_en_1.LANG_EN_TRANS
        } },
];
