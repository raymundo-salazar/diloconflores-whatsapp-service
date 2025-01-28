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
      format: (value, format, lng) => {
        if (format === "uppercase") return value.toUpperCase();
        if (format === "lowercase") return value.toLowerCase();
        if (format === "capitalize") return value.charAt(0).toUpperCase() + value.slice(1);
        if (format?.startsWith("translate:")) {
          const sourceKey = format.split(":")[1]; // Extrae la fuente de traducción dinámica
          return i18next.t(`${sourceKey}.${value.toLowerCase()}`, { lng }) || value;
        }
        return value;
      },
    },
  });

export default i18next;
