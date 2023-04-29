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
    const [callerPeersId, setCallerPeersId] = useState<any>()
    const [receivingCall, setReceivingCall] = useState(false)
    const [isConnectToCall, setIsConnectToCall] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const connectToCall = (e: any) => {
        setCallerPeersId(activeChat.call.peersUsers.map(x => x.peerId))
        setIsConnectToCall(true)
        setIsModalOpen(true)
    }

    useEffect(() => {
        console.log(callerPeersId); 
    }, [callerPeersId])

    const StartCall = async (e: any) => {
        setIsCallStarted(true);
        setIsModalOpen(true)
    }

    useEffect(() => {
        socket.on("callRequest", (data: any) => {
            console.log(data);
            setReceivingCall(true)
            setCallerPeersId([data.peerId])
            var call = data.call.peersUsers.map((x: { peerId: any; user: any; }) => ({
                peerId: x.peerId,
                user: x.user
            }))

            setActiveChat({
                ...activeChat, call: call
            })

            setIsModalOpen(true)
        })
        return () => {
            socket.removeAllListeners("callRequest")
        }
    }, [callerPeersId, activeChat])

    return (
        <div className="chat-place-holder">
            {
                activeChat.id != -1 ?
                    <ActiveChatHeader StartCall={StartCall} setIsModalOpen={setIsModalOpen} isSideBarOpen={props.isSideBarOpen} setSideBarOpen={props.setSideBarOpen} />
                    :
                    null
            }
            {
                activeChat.call != null && !receivingCall ? // button to connect to video call
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
                    <VideoCall callerPeersId={callerPeersId} receivingCall={receivingCall} isConnectToCall={isConnectToCall} setIsModalOpen={setIsModalOpen} />
                    :
                    null
            }
        </div>
    );
}