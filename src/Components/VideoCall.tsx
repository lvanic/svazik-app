import { useReducer, useState, useRef, useEffect, useLayoutEffect, createRef } from "react"
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";
import { useRecoilState } from "recoil";
import io from 'socket.io-client';
import { socketState } from "../Atoms/SocketState";
import Peer from 'peerjs';

export const VideoCall = (props: any) => {
    const [peer, setPeer] = useState<any>(null);
    const [myStream, setMyStream] = useState<any>(null);
    const [peers, setPeers] = useState<any>({});
    const [peerId, setPeerId] = useState('');
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const usersVideos = useRef<any>([])
    const myVideo = useRef<any>()

    useEffect(() => {
        var peerId = prompt('Это отладка, введите peerId который вам сообщили')
        if (peerId != 'prp' && peerId != null) {
            setPeerId(peerId)
        }
    }, [])

    useEffect(() => {
        myVideo.current.srcObject = myStream;
    }, [myStream])

    useEffect(() => {
        Object.keys(peers).map((peerId: any) => {
            usersVideos.current[peerId].srcObject = peers[peerId]
        })
    }, [peers])

    useEffect(() => {
        // Получение медиапотока
        navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            .then((stream) => {
                setMyStream(stream);
            })
            .catch((error) => {
                console.error('Error accessing media devices', error);
            });

        // Инициализация PeerJS
        const peerHandler = new Peer()

        setPeer(peerHandler);
        // Обработчики событий PeerJS
        peerHandler.on('open', (id: any) => {
            alert(`Peer ID: ${id}`)
            console.log(`Peer ID: ${id}`);
        });

        peerHandler.on('call', (call: any) => {
            // Получение вызова и отправка своего потока
            call.answer(myStream);
            // Добавление потока от нового участника в список участников
            call.on('stream', (remoteStream: any) => {
                setPeers((prevState: any) => {
                    return { ...prevState, [call.peer]: remoteStream };
                });
            });
        });

        // Отключение потока участника, если он ушел из комнаты
        peerHandler.on('close', () => {
            console.log('Peer connection closed');
        });

        return () => {
            peerHandler.disconnect();
        };
    }, []);

    const startCall = () => {
        const call = peer.call(peerId, myStream);
        // Добавление потока от нового участника в список участников
        call.on('stream', (remoteStream: any) => {
            setPeers((prevState: any) => {
                return { ...prevState, [call.peer]: remoteStream };
            });
        });
    };

    const joinCall = () => {
        const call = peer.call(peerId, myStream);
        // Добавление потока от нового участника в список участников
        call.on('stream', (remoteStream: any) => {
            setPeers((prevState: any) => {
                return { ...prevState, [call.peer]: remoteStream };
            });
        });
    };

    const endCall = () => {
        // Отключение потока от других участников
        for (const peerId in peers) {
            peers[peerId].getTracks().forEach((track: any) => track.stop());
        }

        // Отключение собственного потока
        myStream.getTracks().forEach((track: any) => track.stop());
        setPeers({});
        setMyStream(null);
    };

    const toggleAudio = () => {
        const enabled = !audioEnabled;
        setAudioEnabled(enabled);
        myStream.getAudioTracks()[0].setEnabled(enabled);
    };

    const toggleVideo = () => {
        const enabled = !videoEnabled;
        setVideoEnabled(enabled);
        myStream.getVideoTracks()[0].setEnabled(enabled);
    };

    return (
        <div style={{ backgroundColor: 'black', position: 'absolute', top: '0px', left: '0px' }}>
            <h1>Room {peerId}</h1>
            <div>
                <button onClick={startCall}>Start Call</button>
                <button onClick={joinCall}>Join Call</button>
                <button onClick={endCall}>End Call</button>
            </div>
            <div>
                <button onClick={toggleAudio}>
                    {audioEnabled ? 'Disable Audio' : 'Enable Audio'}
                </button>
                <button onClick={toggleVideo}>
                    {videoEnabled ? 'Disable Video' : 'Enable Video'}
                </button>
            </div>
            <div>
                <video ref={myVideo} src={myStream} muted autoPlay />
                {/* Вывод потоков от других участников */}
                {Object.keys(peers).map((peerId: any) => {
                    return (
                        <video key={peerId} ref={el => usersVideos.current[peerId] = el} src={peers[peerId]} autoPlay />
                    );
                })}
            </div>
        </div>
    );
}