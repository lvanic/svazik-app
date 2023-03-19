import { atom } from "recoil";


let initValue = [{ chatId: -1, message: 'Пока что тут пусто' }]
export const notifyState = atom({
    key: 'notify',
    default: initValue,
});