import { atom } from "recoil";
import { UserModel } from "../models/UserModel";

let initValue = ''
export const openKeyState = atom({
    key: 'openKey',
    default: initValue,
  });