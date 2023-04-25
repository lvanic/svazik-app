import { atom } from "recoil";

let initValue = {
    message: '',
    isUpdate: false,
    idUpdateMessage: -1
};
export const inputState = atom({
    key: 'inputState',
    default: initValue,
});