import { useEffect, useReducer, useState } from "react";
import { io } from "socket.io-client";
import { IChat } from "../../Interfaces/IChat";
import { SocketReducer } from "../../Reducers/SocketReducer";
import { GetChatsForUser } from "../../Services/ChatServices";
import { ActiveChat } from "../ActiveChat/ActiveChat";
import { Chats } from "./Chats";

export const Web = () => {
    const [chatList, setChatList] = useState<IChat[]>([]);
    const [activeChat, setActiveChat] = useState<IChat>()
    const [isSideBarOpen, setSideBarOpen] = useState(true)
    const [activeChatId, setActiveChatId] = useState(-1);
    const [socket, dispatch] = useReducer(SocketReducer, io(`${process.env.REACT_APP_SERVER_NAME}`, {
        extraHeaders: {
            authorization: `${localStorage.getItem('access_token')}`
        }
    }));
    useEffect(() => {
        socket.emit('joinRoom', {id: activeChatId});
    }, [activeChatId])
    useEffect(() => {
        socket.on('rooms', data => {
            if (data.meta.itemCount > 0) {
                setChatList(data.items)
            }
        })
        socket.on('messages', data => {
            console.log(data.items);
            setActiveChat(data.items)
        })
        GetChatsForUser(socket);
    }, [])


    return (
        <div className='d-flex' style={{ overflow: 'hidden' }}>
            <Chats chatList={chatList} setActiveChatId={setActiveChatId} isSideBarOpen={isSideBarOpen} setSideBarOpen={setSideBarOpen} />
            <ActiveChat activeChatId={activeChatId} isSideBarOpen={isSideBarOpen} setSideBarOpen={setSideBarOpen} />
        </div>
    );
}