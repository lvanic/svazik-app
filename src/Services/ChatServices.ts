import { Socket } from "socket.io-client";
import { requests } from "../requests";

export async function GetChatsForUser(socket: Socket, _page: Number) {
    let page = {
        page: _page,
        limit: 20
    }
    socket.emit('paginateRooms', page)
}

export async function JoinRoom(id: number, socket: Socket, _page: Number) {
    let page = {
        page: _page,
        limit: 30
    }
    socket.emit('joinRoom', { id: id });
}

export async function EnterRoom(id: number, socket: Socket) {
    socket.emit('enterRoom', { id: id });
}

export async function SearchRooms(socket: Socket, name: string) {
    socket.emit('searchRooms', { name })
}

export async function PuginateMessages(roomId: number, socket: Socket, _page: Number) {
    let page = {
        page: _page,
        limit: 30
    }
    socket.emit('puginateMessages', { id: roomId }, page);
}