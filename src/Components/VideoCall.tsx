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

    const [mySignal, setMySignal] = useState<any>(null)
    const [callerSignal, setCallerSignal] = useState<any>(props.callerSignal)

    const myVideo = useRef<any>()
    const userVideo = useRef<any>([])

    const connectionRef = useRef<any>()


    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream: any) => {
            setStream(stream)
        })
        if (callerSignal == undefined) {
            socket.emit('getCallerSignal', { room: { id: activeChat.id } })
        }

    }, [])

    useEffect(() => {
        console.log(props.callerSignal);
        console.log(callerSignal);
    }, [props.callerSignal])

    useEffect(() => {
        socket.on('getCallerSignal', (data: any) => {
            if (mySignal != null) {
                console.log(mySignal);
                socket.emit('callRequest', {
                    signal: mySignal,
                    room: { id: activeChat.id },
                })
            }
        })
    }, [mySignal])

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
            setMySignal(data)
            socket.emit("callRequest", {
                room: {
                    id: activeChat.id,
                    name: activeChat.name
                },
                signalData: mySignal
            })
        })

        peer.on("stream", (stream) => {
            setUserStream(stream)
        })

        socket.on("callAccepted", (signal) => {//+            
            setCallAccepted(true)
            peer.signal(signal.signal)
        })

        socket.on("connectToCall", (signal) => {           
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
            setMySignal(data)
            socket.emit("answerCall", {
                signal: mySignal,
                room: { id: activeChat.id },
            })
        })

        peer.on("stream", (stream) => {//+
            setUserStream(stream)
        })

        socket.on("connectToCall", (signal) => {           
            setCallAccepted(true)
            peer.signal(signal.signal)
        })

        peer.signal(callerSignal)
        connectionRef.current = peer
    }

    const connectRoom = () => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        })

        peer.on("signal", (data) => {
            socket.emit("connectToCall", {
                signal: data,
                room: { id: activeChat.id },
            })
        })

        peer.on("stream", (stream) => {//+
            setUserStream(stream)
        })
        
        if (callerSignal != undefined)
            peer.signal(callerSignal)
        connectionRef.current = peer
    }

    const leaveCall = () => {
        setCallEnded(true)
        connectionRef.current.destroy()
    }

    return (
        <div className="position-absolute" style={{ background: 'gray', width: '100%', top: '20%' }}>
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
                        ) : props.isConnectToCall ? (
                            <div >
                                <Button color="primary" aria-label="call" onClick={connectRoom}>
                                    Connect
                                </Button>
                            </div>
                        ) : (
                            <Button color="primary" aria-label="call" onClick={callRoom}>
                                Call
                            </Button>
                        )}
                    </div>
                </div>
                <div>
                    {callerSignal != undefined && !callAccepted ? (
                        <div className="caller">
                            <h1 >Звонок</h1>
                            <Button variant="contained" color="primary" onClick={answerCall}>
                                Answer
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div >
    )

} 