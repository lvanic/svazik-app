import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { io } from "socket.io-client";
import { activeChatState } from "../../Atoms/ActiveChat";
import { notifyState } from "../../Atoms/NotifyState";
import { socketState } from "../../Atoms/SocketState";
import { userState } from "../../Atoms/UserState";
import { IChat } from "../../Interfaces/IChat";
import { MessageModel } from "../../models/MessageModel";
import { GetChatsForUser, JoinRoom } from "../../Services/ChatServices";
import { ActiveChat } from "../ActiveChat/ActiveChat";
import { Chats } from "./Chats";
import { Notify } from "./Notify";

export const Web = () => {
    const [chatList, setChatList] = useState<IChat[]>([]);
    const [activeChat, setActiveChat] = useRecoilState(activeChatState)
    const [isSideBarOpen, setSideBarOpen] = useState(true)
    const [socket, setSocket] = useRecoilState(socketState);
    const [prevActiveChatId, setPrevActiveChatId] = useState(activeChat.id)
    const [page, setPage] = useState(1)
    const [Notifies, setNotifies] = useRecoilState(notifyState)
    const KeyClick = (e: any) => {
        if (e.keyCode === 27) {
            console.log(activeChat.id);
        }
    }
    useEffect(() => {
        socket.on('rooms', data => {
            if (data.meta.itemCount > 0) {
                setChatList(chatList.concat(data.items))
            }
        })
        GetChatsForUser(socket, page);

    }, [])

    useEffect(() => {
        if (activeChat.id != -1) {
            socket.on('messages', data => {
                let messages: MessageModel[] = [...data.items];
                messages.reverse()
                console.log(messages);

                setActiveChat({ ...activeChat, messages: messages })
            })
            JoinRoom(activeChat.id, socket, 1)
            if (prevActiveChatId != -1) {
                socket.emit('leaveRoom', { id: prevActiveChatId })
                setPrevActiveChatId(activeChat.id)
            }
        }
    }, [activeChat.id])

    useEffect(() => {
        socket.on('messageAdded', message => {
            if (message.room.id == activeChat.id) {
                let messageHandler = new MessageModel(message.text, message.user, message.created_at);
                setActiveChat({ ...activeChat, messages: [...activeChat.messages, messageHandler] })
            }
            else {
                setNotifies([...Notifies, { message: message.text, chatId: message.room.id }])
            }
        })
        socket.on('messagePaginated', data => {
            let messages: MessageModel[] = [...data.items];
            messages.reverse()
            setActiveChat({ ...activeChat, messages: messages.concat(activeChat.messages) })
        })
    }, [activeChat.messages])

    return (
        <div className='d-flex' style={{ overflow: 'hidden' }}>
            <Notify />
            <Chats chatList={chatList} isSideBarOpen={isSideBarOpen} setSideBarOpen={setSideBarOpen} />
            <ActiveChat isSideBarOpen={isSideBarOpen} setSideBarOpen={setSideBarOpen} />
        </div>
    );
}