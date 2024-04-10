import { Socket } from "socket.io-client";
import { requests } from "../requests";
import { HubConnection } from "@microsoft/signalr";

export function getChatsForUser(socket: HubConnection, _page: Number) {
  let page = {
    page: _page,
    limit: 20,
    paginationType: "take",
  };
  socket.send("PaginateRooms", _page);
}

export async function joinRoom(
  id: number,
  socket: HubConnection,
  _page: Number
) {
  let page = {
    page: _page,
    limit: 30,
  };
  socket.send("joinRoom", { id: id });
}

export async function enterRoom(
  id: number,
  socket: HubConnection,
  title: string
) {
  socket.send("enterRoom", { id: id, name: title });
}

export async function searchRooms(socket: HubConnection, name: string) {
  socket.send("SearchRooms", name);
}

export async function puginateMessages(
  roomId: number,
  socket: HubConnection,
  _page: Number
) {
  socket.send("puginateMessages", { id: roomId }, _page);
}
