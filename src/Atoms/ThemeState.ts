import { atom } from "recoil";

let initValue = 'light'
export const themeState = atom({
    key: 'themeState',
    default: initValue,
});