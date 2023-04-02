import { ActiveChatHeader } from "./ActiveChatHeader";
import { MessageArea } from "./MessageArea";
import './ActiveChat.css'
import { useRecoilState } from "recoil";
import { activeChatState } from "../../Atoms/ActiveChat";
import { useEffect, useRef, useState } from "react";
import { socketState } from "../../Atoms/SocketState";
import { VideoCall } from "../VideoCall";

export const ActiveChat = (props: any) => {
    const [activeChat, setActiveChat] = useRecoilState(activeChatState);
    const [socket, setSocket] = useRecoilState(socketState)
    const [isCallStarted, setIsCallStarted] = useState(false);
    const [callerSignal, setCallerSignal] = useState<any>()
    const [receivingCall, setReceivingCall] = useState(false)

    const StartCall = async (e: any) => {
        setIsCallStarted(true);
    }

    useEffect(() => {
        socket.on("callRequest", (data) => {
            setReceivingCall(true)
            setCallerSignal(data.signal)
        })
    }, [])

    return (
        <div className="chat-place-holder">
            {
                activeChat.id != -1 ?
                    <ActiveChatHeader StartCall={StartCall} isSideBarOpen={props.isSideBarOpen} setSideBarOpen={props.setSideBarOpen} />
                    :
                    null
            }
            <MessageArea />
            {
                isCallStarted || receivingCall ?
                    <VideoCall callerSignal={callerSignal} />
                    :
                    null
            }
        </div>
    );
}