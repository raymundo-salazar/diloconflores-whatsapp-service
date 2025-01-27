import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    preload: ["en", "es"], // Idiomas disponibles
    backend: {
      loadPath: "./src/locales/{{lng}}/translation.json", // Archivos JSON locales
    },
    detection: {
      order: ["querystring", "header"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
