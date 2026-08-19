const path = require('path');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');

i18next
  .use(Backend)
  .init({
    fallbackLng: 'en',
    lng: 'en',
    preload: ['ar', 'fr', 'en'],
    backend: {
      loadPath: path.join(__dirname, '../../frontend/locales/{{lng}}.json')
    },
    interpolation: {
      escapeValue: false
    }
  });

const SUPPORTED_LANGUAGES = ['ar', 'fr', 'en'];

const parseLanguage = (header) => {
  if (!header) return 'en';
  const primary = header.split(',')[0].split(';')[0].split('-')[0].trim().toLowerCase();
  return SUPPORTED_LANGUAGES.includes(primary) ? primary : 'en';
};

const i18nMiddleware = (req, res, next) => {
  const lang = parseLanguage(req.headers['accept-language']);
  req.language = lang;
  req.t = (key, options) => i18next.t(key, { lng: lang, ...options });
  next();
};

module.exports = { i18nMiddleware, i18next };
