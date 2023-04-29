import { useState, useRef, useEffect } from "react"
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";
import { useRecoilState } from "recoil";
import io from 'socket.io-client';
import { socketState } from "../Atoms/SocketState";
import Peer from 'peerjs';
import { activeChatState } from "../Atoms/ActiveChat";
import { resolve } from "path";
import { log } from "console";

export const VideoCall = (props: any) => {
    const [socket, setSocket] = useRecoilState(socketState)
    const [activeChat, setActiveChat] = useRecoilState(activeChatState)
    const [peer, setPeer] = useState<any>(null);
    const [myStream, setMyStream] = useState<any>(null);
    const [peers, setPeers] = useState<{ [id: string]: MediaStream }>({});
    const [myPeerId, setMyPeerId] = useState<string>('');
    const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
    const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
    const usersVideos = useRef<(HTMLVideoElement | null)[]>([]);
    const myVideo = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (myVideo.current && myStream) {
            myVideo.current.srcObject = myStream;
        }
    }, [myStream])

    useEffect(() => {
        Object.keys(peers).forEach((peerId: any) => {
            if (usersVideos.current[peerId]) {
                usersVideos.current[peerId]!.srcObject = peers[peerId]
            }
        })
    }, [peers])

    const initializePeer = async () => {
        var options = {
            config: { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] },
            stream: true
        }
        const peerHandler = new Peer(options)

        setPeer(peerHandler);

        peerHandler.on('open', (id) => {
            setMyPeerId(id)
            socket.emit('callRequest', {
                peerId: id,
                room: activeChat
            })

            if (props.callerPeersId) {
                props.callerPeersId.map((peerId: string) => {
                    const call = peerHandler.call(peerId, myStream);
                    call.on('stream', (remoteStream: any) => {
                        setPeers((prevState) => {
                            return { ...prevState, [call.peer]: remoteStream };
                        });
                    });
                })
            } else {
                const call = peerHandler.call(myPeerId, myStream);
                call.on('stream', (remoteStream: any) => {
                    setPeers((prevState) => {
                        return { ...prevState, [call.peer]: remoteStream };
                    });
                });
            }
            setAudioEnabled(true);
            setVideoEnabled(true);
        });

        peerHandler.on('call', (call: any) => {
            console.log(myStream);
            call.answer(myStream);
            call.on('stream', (remoteStream: any) => {
                setPeers((prevState) => {
                    return { ...prevState, [call.peer]: remoteStream };
                });
            });
        });

        peerHandler.on('close', () => {
            console.log('Peer connection closed');
        });

        return () => {
            peerHandler.disconnect();
        };
    };

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            .then((stream) => {
                setMyStream(stream);
            })
            .catch((error) => {
                console.error('Error accessing media devices', error);
            });

        return () => {
            socket.emit('disconectCall')
        }
    }, []);

    useEffect(() => {
        return () => {
            if (myStream) {
                myStream.getTracks().forEach((track: any) => {
                    track.stop();
                });
            }
        }
    }, [myStream])

    const callPeer = async () => {
        if (!peer) {
            await initializePeer();
        }
    };

    const handleAudioClick = () => {
        if (myStream) {
            myStream.getAudioTracks().forEach((track: any) => {
                track.enabled = !audioEnabled;
                setAudioEnabled((prevState) => !prevState);
            });
        }
    };

    const handleVideoClick = () => {
        if (myStream) {
            myStream.getVideoTracks().forEach((track: any) => {
                track.enabled = !videoEnabled;
                setVideoEnabled((prevState) => !prevState);
                if (myVideo.current) {
                    myVideo.current.srcObject = null;
                    myVideo.current.srcObject = myStream;
                }
            })
        }
    };

    return (
        <div className="container-fluid" style={{ position: 'absolute', top: '20px' }}>
            <div className="row">
                <div className="col-lg-9">
                    <div className="row">
                        <div className="col-md-6">
                            <Card>
                                <Card.Body>
                                    <video
                                        ref={myVideo}
                                        muted
                                        autoPlay
                                        style={{ width: "100%", height: "auto" }}
                                    />
                                    <Button variant="primary" onClick={() => callPeer()}>{props.receivingCall ? 'Answer' : props.isConnectToCall ? 'Conect' : 'Call'}</Button>
                                    <Button variant="danger" onClick={() => handleAudioClick()}>
                                        {audioEnabled ? 'Mute' : 'Unmute'}
                                    </Button>
                                    <Button variant="warning" onClick={() => handleVideoClick()}>
                                        {videoEnabled ? 'Disable Video' : 'Enable Video'}
                                    </Button>

                                    <Button variant="danger" onClick={() => props.setIsModalOpen(false)}>
                                        {props.receivingCall ? 'Reject' : 'Close'}
                                    </Button>
                                </Card.Body>
                            </Card>
                        </div>
                        {Object.keys(peers).map((peerId: any, index) => (
                            <div key={index} className="col-md-6">
                                <Card>
                                    <Card.Body>
                                        <video
                                            ref={(videoEl) => (usersVideos.current[peerId] = videoEl)}
                                            autoPlay
                                            style={{ width: "100%", height: "auto" }}
                                        />
                                    </Card.Body>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};