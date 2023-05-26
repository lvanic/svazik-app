import { useState, useRef, useEffect, useCallback } from "react"
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";
import { useRecoilState } from "recoil";
import io from 'socket.io-client';
import { socketState } from "../Atoms/SocketState";
import Peer, { MediaConnection } from 'peerjs';
import { activeChatState } from "../Atoms/ActiveChat";
import './VideoCall.css'

export const VideoCall = (props: any) => {
    const [callStarted, setCallStarted] = useState(false)
    const [socket, setSocket] = useRecoilState(socketState)
    const [activeChat, setActiveChat] = useRecoilState(activeChatState)
    const [peer, setPeer] = useState<any>(null);
    const [myStream, setMyStream] = useState<any>(null);
    const [peers, setPeers] = useState<{ [id: string]: MediaStream }>({});
    const [myPeerId, setMyPeerId] = useState<string>('');
    const [isScreenShare, setScreenShare] = useState(false);
    const [callerPeersId, setCallerPeersId] = useState([{ name: '', peerdId: '' }]);
    const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
    const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
    const usersVideos = useRef<(HTMLVideoElement | null)[]>([]);
    const myVideo = useRef<HTMLVideoElement | null>(null);
    const [calls, setCalls] = useState<MediaConnection[]>([])

    useEffect(() => {
        if (myVideo.current && myStream) {
            myVideo.current.srcObject = myStream;
        }
    }, [myStream])

    useEffect(() => {
        socket.on('userDisconected', (data: any) => {
            setPeers(prevState => {
                const updatedPeers = { ...prevState };
                delete updatedPeers[data.peerId];
                return updatedPeers;
            });
            console.log('peerUpdate');
        })
        socket.on('trackChanged', (data: any) => {

        })

        Object.keys(peers).forEach((peerId: any) => {
            if (usersVideos.current[peerId]) {
                usersVideos.current[peerId]!.srcObject = peers[peerId]
            }
        })
        console.log(peers);
        return () => {
            socket.removeAllListeners('userDisconected')
            socket.removeAllListeners('trackChanged')
        }
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
            if (props.isConnectToCall || props.receivingCall) {
                socket.emit('connectRoom', {
                    peerId: id,
                    room: activeChat
                })

            } else {
                socket.emit('callRequest', {
                    peerId: id,
                    room: activeChat
                })
            }

            if (props.isConnectToCall || props.receivingCall) {
                socket.on('peers', (data: any) => {
                    setCallerPeersId(data.peersUsers.map((x: any) => (
                        {
                            peerId: x.peerId
                        }
                    )))
                    data.peersUsers.map((peerUser: any) => {
                        const call = peerHandler.call(peerUser.peerId, myStream);
                        setCalls([...calls, call])
                        call.on('stream', (remoteStream: MediaStream) => {
                            setPeers((prevState) => {
                                return { ...prevState, [call.peer]: remoteStream };
                            });
                        });
                    })
                })
            } else {
                const call = peerHandler.call(myPeerId, myStream);
                setCalls([...calls, call])
                call.on('stream', (remoteStream: MediaStream) => {
                    setPeers((prevState) => {
                        return { ...prevState, [call.peer]: remoteStream };
                    });
                });
            }
            setAudioEnabled(true);
            setVideoEnabled(true);
        });

        peerHandler.on('call', (call: any) => {
            call.answer(myStream);
            setCalls([...calls, call])
            call.on('stream', (remoteStream: MediaStream) => {
                console.log('remote stream3: ', remoteStream.getVideoTracks());
                remoteStream.onaddtrack = () => alert(3)
                setPeers((prevState) => {
                    return { ...prevState, [call.peer]: remoteStream };
                });
            });
        });

        // peerHandler.on('')

        peerHandler.on('close', () => {
            console.log('Peer connection closed');
        });

        return () => {
            peerHandler.disconnect();
        };
    }

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
            setMyStream(null)
            setPeer(null)
        }
    }, []);

    useEffect(() => {
        return () => {
            socket.emit('refreshRoom', { id: activeChat.id })
        }
    }, [activeChat.id])

    useEffect(() => {
        console.log(myStream);

        return () => {
            if (myStream) {
                myStream.getTracks().forEach((track: any) => {
                    track.stop();
                });
            }
        }
    }, [myStream])

    useEffect(() => {
        return () => {
            if (peer) {
                peer.destroy()
                peer.disconnect()
            }
        }
    }, [peer])

    const callPeer = useCallback(async () => {
        if (!peer) {
            await initializePeer();
        }
        else {
            // alert(peer)
        }
    }, [initializePeer])

    const handleScreenShareClick = () => {
        setScreenShare(!isScreenShare)
        if (myStream) {
            if (!isScreenShare) {
                navigator.mediaDevices.getDisplayMedia({ video: true })
                    .then(screenStream => {
                        // Получение видеотрека с экрана
                        calls.map(conn => {
                            const screenVideoTrack = screenStream.getVideoTracks()[0];

                            myStream.getVideoTracks()[0].stop();
                            myStream.removeTrack(myStream.getVideoTracks()[0])
                            myStream.addTrack(screenVideoTrack)

                            // Отправка обновленного видеопотока с экрана через PeerJS
                            const videoSender = conn.peerConnection.getSenders().find((sender) => {
                                if (sender.track != null) {
                                    return sender.track.kind === 'video'
                                }
                            });
                            if (videoSender)
                                videoSender.replaceTrack(screenVideoTrack);
                        })

                    })
                    .catch(error => {
                        console.error('Ошибка при получении потока с экрана:', error);
                        setScreenShare(false)
                    });
            }
            else {
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(screenStream => {
                        // Получение видеотрека с экрана
                        calls.map(conn => {
                            const screenVideoTrack = screenStream.getVideoTracks()[0];

                            myStream.getVideoTracks()[0].stop();
                            myStream.removeTrack(myStream.getVideoTracks()[0])
                            myStream.addTrack(screenVideoTrack)

                            // Отправка обновленного видеопотока с экрана через PeerJS
                            const videoSender = conn.peerConnection.getSenders().find((sender) => {
                                if (sender.track != null) {
                                    return sender.track.kind === 'video'
                                }
                            });
                            if (videoSender)
                                videoSender.replaceTrack(screenVideoTrack);
                        })
                    }).catch(error => {
                        console.error('Ошибка при получении потока с экрана:', error);
                        setScreenShare(true)
                    })
            }
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
            myStream.getVideoTracks().forEach((track: MediaStreamTrack) => {
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
        <div className="container-fluid" style={{ position: 'absolute', top: '20px', left: '0px', width: '100%', zIndex: '4000' }}>
            <div>
                <div>
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <Card className="w-75 call-container">
                            <div className="d-flex flex-row justify-content-center">
                                <Card style={{ maxWidth: '400px', zIndex: '4000' }} className="call-video">
                                    <Card.Body>
                                        <video
                                            ref={myVideo}
                                            muted
                                            autoPlay
                                            style={{ width: "100%", height: "auto" }}
                                        />
                                        {
                                            callStarted ?
                                                null
                                                :
                                                <Button variant="primary" onClick={() => callPeer()}>{props.receivingCall ? 'Answer' : props.isConnectToCall ? 'Conect' : 'Call'}</Button>

                                        }
                                        <Button variant="warning" onClick={() => handleScreenShareClick()}>
                                            {isScreenShare ? 'Share off' : 'Share on'}
                                        </Button>
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
                            <div className="d-flex justify-content-around" style={{ paddingLeft: '20%', paddingRight: '20%' }}>
                                {Object.keys(peers).map((peerId: any, index) => (
                                    index > 4 ? null :
                                        < div key={-index} style={{ maxWidth: '300px' }} className="d-flex justify-content-around" >
                                            <Card className="call-video">
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
                        </Card>
                    </div>
                </div>
            </div>
        </div >
    );
};