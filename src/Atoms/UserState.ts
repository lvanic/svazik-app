import { atom } from "recoil";
import { UserModel } from "../models/UserModel";

let initValue = new UserModel('','',false);
export const userState = atom({
    key: 'userState',
    default: initValue,
  });