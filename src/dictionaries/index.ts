import pt_BR from "./pt_BR.json";
import en_US from "./en_US.json";

type Language = keyof typeof dictionaries;

interface Dictionary {
    [key: string]: string;
}

interface ReplaceMatrix {
    [key: string]: string;
}

const dictionaries: {
    pt_BR: Dictionary;
    en_US: Dictionary;
} = {
    pt_BR,
    en_US,
};

const languageList = Object.keys(dictionaries) as Language[];

export default dictionaries;
export { pt_BR, en_US, languageList };
export type { Language, Dictionary, ReplaceMatrix };
