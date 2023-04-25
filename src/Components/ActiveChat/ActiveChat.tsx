import { ActiveChatHeader } from "./ActiveChatHeader";
import { MessageArea } from "./MessageArea";
import './ActiveChat.css'
import { useRecoilState } from "recoil";
import { activeChatState } from "../../Atoms/ActiveChat";
import { useEffect, useRef, useState } from "react";
import { socketState } from "../../Atoms/SocketState";
import { VideoCall } from "../VideoCall";
import { log } from "console";
import { Offcanvas } from "react-bootstrap";

export const ActiveChat = (props: any) => {
    const [activeChat, setActiveChat] = useRecoilState(activeChatState);
    const [socket, setSocket] = useRecoilState(socketState)
    const [isCallStarted, setIsCallStarted] = useState(false);
    const [callerSignal, setCallerSignal] = useState<any>()
    const [receivingCall, setReceivingCall] = useState(false)
    const [isConnectToCall, setIsConnectToCall] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    
    const connectToCall = (e: any) => {
        setIsConnectToCall(true)
        setIsModalOpen(true)
    }

    const StartCall = async (e: any) => {
        setIsCallStarted(true);
        setIsModalOpen(true)
    }

    useEffect(() => {
        socket.on("callRequest", (data) => {
            setReceivingCall(true)
            setCallerSignal(data.signal)
            console.log(data);

            setIsModalOpen(true)
        })
        return () => {
            socket.removeAllListeners("callRequest")
        }
    }, [callerSignal])

    return (
        <div className="chat-place-holder">
            {
                activeChat.id != -1 ?
                    <ActiveChatHeader StartCall={StartCall} setIsModalOpen={setIsModalOpen} isSideBarOpen={props.isSideBarOpen} setSideBarOpen={props.setSideBarOpen} />
                    :
                    null
            }
            {
                activeChat.isCall ? // button to connect to video call
                    <div className="w-100"
                        style={{ position: 'relative', top: '15px', zIndex: 1000 }}
                    >
                        <button className="w-100"
                            onClick={connectToCall}
                        >Connect to Call</button>
                    </div>
                    : null
            }
            <MessageArea />
            {
                isModalOpen && (isCallStarted || receivingCall || isConnectToCall) ?
                    <VideoCall callerSignal={callerSignal} isConnectToCall={isConnectToCall} setIsModalOpen={setIsModalOpen} />
                    :
                    null
            }
        </div>
    );
}