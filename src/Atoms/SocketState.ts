import { atom } from "recoil";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

let initValue: HubConnection = new HubConnectionBuilder()
  .withUrl("http://localhost:3000")
  .build();

export const socketState = atom({
  key: "socket",
  default: initValue,
  dangerouslyAllowMutability: true,
  effects: [
    (val) => {
      val.onSet(async (hub) => hub.start());
      return () => {};
    },
  ],
});
