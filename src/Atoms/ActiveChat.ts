import { atom } from "recoil";
import { ChatModel } from "../models/ChatModel";

let initValue = new ChatModel(-1, 'Sviazik', 'Please update page', [], [], [], null, '', 0)
export const activeChatState = atom({
    key: 'activeChat',
    default: initValue, 
});