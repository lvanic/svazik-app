import { Socket } from "socket.io-client";
import { requests } from "../requests";

export function getChatsForUser(socket: Socket, _page: Number) {
    let page = {
        page: _page,
        limit: 15
    }
    socket.emit('paginateRooms', page)
}

export async function joinRoom(id: number, socket: Socket, _page: Number) {
    let page = {
        page: _page,
        limit: 30
    }
    socket.emit('joinRoom', { id: id });
}

export async function enterRoom(id: number, socket: Socket) {
    socket.emit('enterRoom', { id: id });
}

export async function searchRooms(socket: Socket, name: string) {
    socket.emit('searchRooms', { name })
}

export async function puginateMessages(roomId: number, socket: Socket, _page: Number) {
    let page = {
        page: _page,
        limit: 30
    }
    socket.emit('puginateMessages', { id: roomId }, page);
}