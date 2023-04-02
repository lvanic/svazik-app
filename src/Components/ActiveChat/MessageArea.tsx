import { useEffect, useReducer, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { activeChatState } from "../../Atoms/ActiveChat";
import { userState } from "../../Atoms/UserState";
import { MessageInput } from "./MessageInput";
import { Message } from "./Message"
import { puginateMessages } from "../../Services/ChatServices";
import { socketState } from "../../Atoms/SocketState";

export const MessageArea = (props: any) => {
    const [activeChat, setActiveChat] = useRecoilState(activeChatState);
    const [socket, setSocket] = useRecoilState(socketState);
    const user = useRecoilValue(userState);
    const endChatRef = useRef<HTMLDivElement | null>(null);
    const [page, setPage] = useState(1);

    console.log(activeChat.messages);
    
    useEffect(() => {//last or saved(may be)
        endChatRef?.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
    }, [activeChat.messages.length])

    useEffect(() => {
        setPage(1)
    }, [activeChat.id])

    const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        if (event.currentTarget.scrollTop == 0) {
            puginateMessages(activeChat.id, socket, page)
            setPage(page + 1)
        }
    };

    return (
        <>
            {
                activeChat.id == undefined ?
                    null
                    :
                    <div className="message-handler">
                        <div className="messages"
                            ref={endChatRef}
                            onScroll={handleScroll}>
                            {activeChat.messages?.map((message: any) => {
                                if (user.username == message.user.username) {
                                    return (
                                        <Message text={message.text}  name={message.user.username} key={message.id} location='end' />
                                    )
                                } else {
                                    return (
                                        <Message text={message.text} name={message.user.username} key={message.id} location='start' />
                                    )
                                }
                            }
                            )}

                        </div>
                        {
                            activeChat.id != -1 ?
                                <div>
                                    <MessageInput activeChatId={props.activeChatId} />
                                </div>
                                :
                                null
                        }
                    </div>
            }
        </>
    )
}