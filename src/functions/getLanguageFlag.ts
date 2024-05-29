import { Language } from "@dictionaries";

function getLanguageFlag(language: Language) {
    const [, country] = language.split("_");
    return `https://flagcdn.com/w20/${country.toLowerCase()}.png`;
}

export { getLanguageFlag };
export default getLanguageFlag;
