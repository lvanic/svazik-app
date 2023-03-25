import { useReducer, useState, useRef, useEffect, useLayoutEffect } from "react"
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";
import { useRecoilState } from "recoil";
import io from 'socket.io-client';
import { socketState } from "../Atoms/SocketState";
import Peer from "simple-peer";
import { activeChatState } from "../Atoms/ActiveChat";

export const VideoCall = (props: any) => {
    const [socket, setSocket] = useRecoilState(socketState);
    const [activeChat, setActiveChat] = useRecoilState(activeChatState)

    const [stream, setStream] = useState<any>()
    const [receivingCall, setReceivingCall] = useState(false)
    const [caller, setCaller] = useState("")
    const [callerSignal, setCallerSignal] = useState<any>()
    const [callAccepted, setCallAccepted] = useState(false)
    const [idToCall, setIdToCall] = useState("")
    const [callEnded, setCallEnded] = useState(false)
    const [name, setName] = useState("")
    const myVideo = useRef<any>()
    const userVideo = useRef<any>()
    const connectionRef = useRef<any>()

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream: any) => {
            setStream(stream)
            myVideo.current.srcObject = stream
        })

        socket.on("callRequest", (data) => {
            setReceivingCall(true)
            setCallerSignal(data.signal)
            setCaller(data.from.username)
        })
        
    }, [])

    const callUser = (id: any) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }
                ]
            }
        })

        peer.on("signal", (data: any) => {
            socket.emit("callRequest", {
                room: {
                    id: activeChat.id
                },
                signalData: data
            })
        })
        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream
        })
        socket.on("callAccepted", (signal) => {
            setCallAccepted(true)
            peer.signal(signal)
        })

        connectionRef.current = peer
    }

    const answerCall = () => {
        setCallAccepted(true)
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }
                ]
            }
        })
        peer.on("signal", (data) => {
            socket.emit("answerCall", {
                signal: data,
                room: { id: activeChat.id },
            })
        })
        peer.on("stream", (stream) => {
            console.log(stream);
            userVideo.current.srcObject = stream
        })

        peer.signal(callerSignal)
        connectionRef.current = peer
    }

    const leaveCall = () => {
        setCallEnded(true)
        connectionRef.current.destroy()
    }

    return (
        <div className="position-absolute d-flex" style={{ background: 'gray', top: '10%' }}>
            <div className="container">
                <div className="video-container">
                    <div className="video">
                        {stream && <video playsInline ref={myVideo} autoPlay style={{ width: "300px" }} />}
                    </div>
                    <div className="video">
                        {callAccepted && !callEnded ?
                            <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} /> :
                            null}
                    </div>
                </div>
                <div className="myId">

                    <div className="call-button">
                        {callAccepted && !callEnded ? (
                            <Button variant="contained" color="secondary" onClick={leaveCall}>
                                End Call
                            </Button>
                        ) : (
                            <Button color="primary" aria-label="call" onClick={() => callUser(idToCall)}>
                                Call
                            </Button>
                        )}
                        {idToCall}
                    </div>
                </div>
                <div>
                    {receivingCall && !callAccepted ? (
                        <div className="caller">
                            <h1 >{name} is calling...</h1>
                            <Button variant="contained" color="primary" onClick={answerCall}>
                                Answer
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )

} 