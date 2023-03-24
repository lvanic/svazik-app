import { atom } from "recoil";
import { NotifyModel } from "../models/NotifyModel";


let initValue: NotifyModel[] = []
export const notifyState = atom({
    key: 'notify',
    default: initValue,
});