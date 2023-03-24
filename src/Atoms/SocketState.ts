import { atom } from "recoil";
import { io, Socket } from "socket.io-client";

let initValue = io();
export const socketState = atom<Socket>({
  key: 'socket',
  default: initValue,
  dangerouslyAllowMutability: true,
});