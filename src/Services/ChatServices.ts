import { Socket } from "socket.io-client";
import { requests } from "../requests";

export async function GetChatsForUser(socket: Socket) {
    // console.log(socket);

    let page = {
        page: 1,
        limit: 10
    }
    socket.emit('paginateRooms', page)

}