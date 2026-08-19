const i18next = require('i18next');
const Backend = require('i18next-fs-backend');

i18next
  .use(Backend)
  .init({
    fallbackLng: 'en',
    lng: 'en',
    preload: ['ar', 'fr', 'en'],
    backend: {
      loadPath: './locales/{{lng}}.json'
    },
    interpolation: {
      escapeValue: false
    }
  });

const i18nMiddleware = (req, res, next) => {
  const lang = req.headers['accept-language'] || 'en';
  req.language = lang;
  req.t = (key, options) => i18next.t(key, { lng: lang, ...options });
  next();
};

module.exports = { i18nMiddleware, i18next };