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

    const [stream, setStream] = useState<any>(null)
    const [userStream, setUserStream] = useState<any>([])

    const [callAccepted, setCallAccepted] = useState(false)
    const [callEnded, setCallEnded] = useState(false)

    const myVideo = useRef<any>()
    const userVideo = useRef<any>([])

    const connectionRef = useRef<any>()

    useEffect(() => {
        console.log(connectionRef);

    }, [connectionRef])

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream: any) => {
            setStream(stream)
        })

    }, [])

    useEffect(() => {
        if (myVideo.current != undefined) {
            myVideo.current.srcObject = stream
        }
    }, [stream])

    useEffect(() => {
        if (userVideo.current != undefined) {
            userVideo.current.srcObject = userStream
        }
        console.log(userStream);
    }, [userStream])

    const callRoom = () => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
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
            setUserStream(stream)
        })

        socket.on("callAccepted", (signal) => {//+            
            setCallAccepted(true)
            peer.signal(signal.signal)
        })

        connectionRef.current = peer
    }

    const answerCall = (e: any) => {
        setCallAccepted(true)
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        })

        peer.on("signal", (data) => {
            socket.emit("answerCall", {
                signal: data,
                room: { id: activeChat.id },
            })
        })

        peer.on("stream", (stream) => {//+
            setUserStream(stream)
        })

        peer.signal(props.callerSignal)
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
                        {stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: "301px" }} />}
                    </div>
                    <div className="video">
                        {callAccepted && !callEnded ?
                            <video playsInline ref={userVideo} autoPlay style={{ width: "301px" }} /> :
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
                            <Button color="primary" aria-label="call" onClick={callRoom}>
                                Call
                            </Button>
                        )}
                    </div>
                </div>
                <div>
                    {props.callerSignal != undefined && !callAccepted ? (
                        <div className="caller">
                            <h1 >Звонок</h1>
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