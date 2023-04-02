import { atom } from "recoil";

let initValue = null;
export const callState = atom({
    key: 'callState',
    default: initValue, 
});