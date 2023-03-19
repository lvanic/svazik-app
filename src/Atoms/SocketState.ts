import { atom } from "recoil";
import { io } from "socket.io-client";

let initValue = io();
export const socketState = atom({
  key: 'socket',
  default: initValue,
  dangerouslyAllowMutability: true,
});