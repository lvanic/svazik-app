import { useEffect, useLayoutEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { io } from "socket.io-client";
import { activeChatState } from "../../Atoms/ActiveChat";
import { notifyState } from "../../Atoms/NotifyState";
import { socketState } from "../../Atoms/SocketState";
import { userState } from "../../Atoms/UserState";
import { IChat } from "../../Interfaces/IChat";
import { MessageModel } from "../../models/MessageModel";
import { getChatsForUser, joinRoom } from "../../Services/ChatServices";
import { ActiveChat } from "../ActiveChat/ActiveChat";
import { Chats } from "./Chats";
import { Notify } from "./Notify";

export const Web = () => {
    const [chatList, setChatList] = useState<IChat[]>([]);
    const [activeChat, setActiveChat] = useRecoilState(activeChatState)
    const [isSideBarOpen, setSideBarOpen] = useState(true)
    const [socket, setSocket] = useRecoilState(socketState);
    const [prevActiveChatId, setPrevActiveChatId] = useState(activeChat.id)
    const [user, setUser] = useRecoilState(userState);
    const [page, setPage] = useState(0)
    const [notifies, setNotifies] = useRecoilState(notifyState)

    const KeyClick = (e: any) => { //при нажатии на esc закрывать активный чат и открывать список чатов
        if (e.keyCode == 27) {
            setActiveChat({ ...activeChat, id: -1 })
        }
    }

    useEffect(() => {
        //при нажатии на esc закрывать активный чат и открывать список чатов
        document.addEventListener('keydown', KeyClick, false);
        return () => {
            document.removeEventListener('keydown', KeyClick, false);
        }
    }, [])

    useEffect(() => {
        socket.on('notify', data => {
            setNotifies([...notifies, { message: data.message, chatId: data.chatId, chatName: data.chatName }])
        })
        return (() => {
            socket.removeAllListeners("notify");
        })
    }, [notifies])

    useEffect(() => {
        if (user.isAuthorized) {
            socket.on('rooms', data => {
                // console.log(data)
                setRooms(data)
            })
            getChatsForUser(socket, page);
        }
        return (() => {
            socket.removeAllListeners("rooms");
        })
    }, [page])

    useEffect(() => {
        if (activeChat.id != -1) {
            socket.on('messages', data => {
                console.log(data);

                let messages: MessageModel[] = [...data.messages.items];
                messages.reverse()
                setActiveChat({
                    ...activeChat,
                    messages: messages,
                    call: data.callRoom,
                    admins: data.room.admins,
                    users: data.room.users,
                    shareString: data.shareString,
                    onlineCount: data.onlineCount
                })
            })

            if (prevActiveChatId != -1) {
                socket.emit('leaveRoom', { id: prevActiveChatId })
                setPrevActiveChatId(activeChat.id)
            }
            else {
                setPrevActiveChatId(activeChat.id)
            }
            joinRoom(activeChat.id, socket, 1)
        }
        return (() => {
            socket.removeAllListeners("messages");
        })
    }, [activeChat.id])

    useEffect(() => {
        socket.on('removedFromRoom', (room) => {
            setChatList([...chatList.filter(x => x.id != room.id)])
            if (activeChat.id == room.id) {
                setActiveChat({ ...activeChat, id: -1 })
            }
        })
        return () => {
            socket.removeAllListeners('removedFromRoom')
        }
    }, [activeChat.id, chatList])
    useEffect(() => {
        socket.on('messageAdded', message => {
            if (message.room.id == activeChat.id) {
                let messageHandler = new MessageModel(message.id, message.text, message.user, message.created_at);
                setActiveChat({ ...activeChat, messages: [...activeChat.messages, messageHandler] })
            }
        })

        socket.on('messageUpdated', message => {
            setActiveChat({
                ...activeChat, messages: activeChat.messages.map(x => x.id == message.id
                    ?
                    { ...x, text: message.text }
                    :
                    x
                )
            })
        })

        socket.on('messageDeleted', message => {
            setActiveChat({
                ...activeChat, messages: activeChat.messages.filter(x => x.id != message.id)
            })
        })

        socket.on('messagePaginated', data => {
            let messages: MessageModel[] = [...data.items];
            messages.reverse()
            setActiveChat({ ...activeChat, messages: messages.concat(activeChat.messages) })
        })

        return (() => {
            socket.removeAllListeners("messageAdded");
            socket.removeAllListeners("messagePaginated");
            socket.removeAllListeners('messageDeleted');
            socket.removeAllListeners('messageUpdated');
        })
    }, [activeChat.messages])

    const setRooms = (data: any) => {
        if (data.meta.itemCount > 0) {
            setChatList([...chatList, ...data.items])
        }
        else {
        }
    }

    return (
        <div className='d-flex' style={{ overflow: 'hidden' }}>
            <Notify />
            <Chats page={page} setPage={setPage} chatList={chatList} isSideBarOpen={isSideBarOpen} setSideBarOpen={setSideBarOpen} />
            <ActiveChat isSideBarOpen={isSideBarOpen} setSideBarOpen={setSideBarOpen} />
        </div>
    );
}