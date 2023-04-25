import { atom } from "recoil";
import { Languages } from "../Languages/Languages";

let initValue = {
    name: localStorage.getItem('language'),
    words: Languages.find(x => x.name == localStorage.getItem('language'))?.words
}
if(!initValue){
    initValue = {
        name: 'ru',
        words: Languages.find(x => x.name == 'ru')?.words
    }
}

export const languageState = atom({
    key: 'languageState',
    default: initValue,
});